import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return jsonResponse({ error: 'Stripe is not configured.' }, 400);
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return jsonResponse({ error: 'Not authenticated' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return jsonResponse({ error: 'Invalid token' }, 401);

    const { orderId, successUrl, cancelUrl } = await req.json();
    if (!orderId || typeof orderId !== 'string') {
      return jsonResponse({ error: 'orderId required' }, 400);
    }

    // Load order + items owned by user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();
    if (orderError || !order) return jsonResponse({ error: 'Order not found' }, 404);

    if (order.status && !['pending', 'cancelled'].includes(order.status)) {
      return jsonResponse({ error: 'Order is not payable' }, 400);
    }

    // ----- SERVER-SIDE PRICE RECALCULATION -----
    const items = order.order_items as any[];
    const productIds = items.map((i) => i.product_id).filter(Boolean);
    const variantIds = items.map((i) => i.variant_id).filter(Boolean);

    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('id, name, price, discount_price, is_active, stock')
      .in('id', productIds);
    if (prodErr) return jsonResponse({ error: 'Failed to load products' }, 500);
    const productMap = new Map(products!.map((p) => [p.id, p]));

    let variantMap = new Map<string, any>();
    if (variantIds.length > 0) {
      const { data: variants } = await (supabase as any)
        .from('product_variants')
        .select('id, product_id, color, storage, price, discount_price, stock')
        .in('id', variantIds);
      variantMap = new Map((variants || []).map((v: any) => [v.id, v]));
    }

    let subtotal = 0;
    const verifiedItems: { name: string; image: string | null; unitAmount: number; quantity: number }[] = [];
    for (const item of items) {
      const p = productMap.get(item.product_id);
      if (!p || !p.is_active) {
        return jsonResponse({ error: `Product unavailable: ${item.product_name}` }, 400);
      }

      let unitPrice = Number(p.discount_price ?? p.price);
      let displayName = p.name;

      if (item.variant_id) {
        const v = variantMap.get(item.variant_id);
        if (!v || v.product_id !== p.id) {
          return jsonResponse({ error: `Variant unavailable for ${p.name}` }, 400);
        }
        unitPrice = Number(v.discount_price ?? v.price);
        const label = [v.color, v.storage].filter(Boolean).join(' · ');
        if (label) displayName = `${p.name} — ${label}`;
      }

      if (item.quantity <= 0) {
        return jsonResponse({ error: 'Invalid quantity' }, 400);
      }
      subtotal += unitPrice * item.quantity;
      verifiedItems.push({
        name: displayName,
        image: item.product_image || null,
        unitAmount: Math.round(unitPrice * 100),
        quantity: item.quantity,
      });
    }

    // Shipping
    let shippingCost = 0;
    if (order.shipping_method_id) {
      const { data: shipping } = await supabase
        .from('shipping_methods')
        .select('price, is_active')
        .eq('id', order.shipping_method_id)
        .single();
      if (!shipping || !shipping.is_active) {
        return jsonResponse({ error: 'Invalid shipping method' }, 400);
      }
      shippingCost = subtotal >= 50 && Number(shipping.price) > 0 ? 0 : Number(shipping.price);
    }

    // Coupon
    let discount = 0;
    if (order.coupon_code) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', order.coupon_code)
        .eq('is_active', true)
        .maybeSingle();
      const valid =
        coupon &&
        (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) &&
        (!coupon.min_order_amount || subtotal >= Number(coupon.min_order_amount)) &&
        (!coupon.max_uses || (coupon.used_count ?? 0) < coupon.max_uses);
      if (valid) {
        const raw =
          coupon.discount_type === 'percentage'
            ? subtotal * (Number(coupon.discount_value) / 100)
            : Number(coupon.discount_value);
        discount = Math.min(raw, subtotal);
      } else {
        // Drop invalid coupon silently
        await supabase.from('orders').update({ coupon_code: null }).eq('id', orderId);
      }
    }

    const total = Math.max(0, subtotal - discount + shippingCost);

    // Persist authoritative totals
    await supabase
      .from('orders')
      .update({ subtotal, shipping_cost: shippingCost, discount, total })
      .eq('id', orderId);

    // ----- STRIPE -----
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId =
      customers.data[0]?.id ??
      (await stripe.customers.create({ email: user.email, metadata: { supabase_user_id: user.id } })).id;

    const lineItems = verifiedItems.map((i) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: i.name, images: i.image ? [i.image] : [] },
        unit_amount: i.unitAmount,
      },
      quantity: i.quantity,
    }));
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping', images: [] },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    let discounts: { coupon: string }[] | undefined;
    if (discount > 0) {
      const c = await stripe.coupons.create({
        amount_off: Math.round(discount * 100),
        currency: 'usd',
        duration: 'once',
        name: order.coupon_code || 'Discount',
      });
      discounts = [{ coupon: c.id }];
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${req.headers.get('origin')}/order-success?order=${orderId}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/checkout`,
      metadata: { order_id: orderId, user_id: user.id },
      ...(discounts ? { discounts } : {}),
    });

    await supabase.from('orders').update({ stripe_session_id: session.id }).eq('id', orderId);

    return jsonResponse({ url: session.url, sessionId: session.id, total });
  } catch (err) {
    console.error('Checkout error:', err);
    return jsonResponse({ error: 'An internal error occurred. Please try again.' }, 500);
  }
});
