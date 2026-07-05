import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

interface IncomingItem {
  product_id: string;
  variant_id?: string | null;
  quantity: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Not authenticated' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) return json({ error: 'Not authenticated' }, 401);

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') return json({ error: 'Invalid request' }, 400);

    const items: IncomingItem[] = Array.isArray(body.items) ? body.items : [];
    const shippingAddressId: string | null = body.shipping_address_id ?? null;
    const shippingMethodId: string | null = body.shipping_method_id ?? null;
    const couponCodeRaw: string | null = body.coupon_code ?? null;

    if (items.length === 0) return json({ error: 'Cart is empty' }, 400);
    if (!shippingAddressId) return json({ error: 'Shipping address required' }, 400);

    for (const it of items) {
      if (!it.product_id || typeof it.product_id !== 'string') return json({ error: 'Invalid item' }, 400);
      if (!Number.isInteger(it.quantity) || it.quantity <= 0 || it.quantity > 100) {
        return json({ error: 'Invalid quantity' }, 400);
      }
    }

    // Verify address belongs to user
    const { data: address } = await supabase
      .from('addresses')
      .select('id, user_id')
      .eq('id', shippingAddressId)
      .maybeSingle();
    if (!address || address.user_id !== user.id) {
      return json({ error: 'Invalid shipping address' }, 400);
    }

    // Load products
    const productIds = [...new Set(items.map((i) => i.product_id))];
    const { data: products, error: pErr } = await supabase
      .from('products')
      .select('id, name, price, discount_price, is_active')
      .in('id', productIds);
    if (pErr) return json({ error: 'Failed to load products' }, 500);
    const productMap = new Map(products!.map((p) => [p.id, p]));

    // Load variants
    const variantIds = items.map((i) => i.variant_id).filter(Boolean) as string[];
    let variantMap = new Map<string, any>();
    if (variantIds.length > 0) {
      const { data: variants } = await (supabase as any)
        .from('product_variants')
        .select('id, product_id, color, storage, price, discount_price')
        .in('id', variantIds);
      variantMap = new Map((variants || []).map((v: any) => [v.id, v]));
    }

    // Load product image (first one) for each product for snapshotting
    const { data: productImages } = await supabase
      .from('product_images')
      .select('product_id, url, sort_order')
      .in('product_id', productIds)
      .order('sort_order', { ascending: true });
    const firstProductImage = new Map<string, string>();
    for (const img of productImages || []) {
      if (!firstProductImage.has(img.product_id)) firstProductImage.set(img.product_id, img.url);
    }

    // Compute subtotal + build order_items rows
    let subtotal = 0;
    const orderItemRows: any[] = [];
    for (const it of items) {
      const p = productMap.get(it.product_id);
      if (!p || !p.is_active) return json({ error: 'A product is no longer available' }, 400);

      let unit = Number(p.discount_price ?? p.price);
      let variantLabel: string | null = null;
      let variantColor: string | null = null;
      let variantStorage: string | null = null;
      let variantId: string | null = null;

      if (it.variant_id) {
        const v = variantMap.get(it.variant_id);
        if (!v || v.product_id !== p.id) return json({ error: 'Invalid product variant' }, 400);
        unit = Number(v.discount_price ?? v.price);
        variantColor = v.color ?? null;
        variantStorage = v.storage ?? null;
        variantLabel = [v.color, v.storage].filter(Boolean).join(' · ') || null;
        variantId = v.id;
      }

      subtotal += unit * it.quantity;
      orderItemRows.push({
        product_id: p.id,
        product_name: p.name,
        product_image: firstProductImage.get(p.id) ?? null,
        price: unit,
        quantity: it.quantity,
        variant_id: variantId,
        variant_label: variantLabel,
        variant_color: variantColor,
        variant_storage: variantStorage,
      });
    }

    // Shipping
    let shippingCost = 0;
    if (shippingMethodId) {
      const { data: shipping } = await supabase
        .from('shipping_methods')
        .select('id, price, is_active')
        .eq('id', shippingMethodId)
        .maybeSingle();
      if (!shipping || !shipping.is_active) return json({ error: 'Invalid shipping method' }, 400);
      shippingCost = subtotal >= 50 && Number(shipping.price) > 0 ? 0 : Number(shipping.price);
    }

    // Coupon
    let discount = 0;
    let acceptedCoupon: string | null = null;
    if (couponCodeRaw) {
      const code = String(couponCodeRaw).toUpperCase().trim();
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code)
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
        acceptedCoupon = coupon.code;
      }
    }

    const total = Math.max(0, subtotal - discount + shippingCost);

    // Insert order (service-role bypasses RLS)
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        subtotal,
        shipping_cost: shippingCost,
        discount,
        total,
        status: 'pending',
        shipping_address_id: shippingAddressId,
        shipping_method_id: shippingMethodId,
        coupon_code: acceptedCoupon,
      })
      .select()
      .single();
    if (orderErr || !order) {
      console.error('Order insert failed:', orderErr);
      return json({ error: 'Failed to create order' }, 500);
    }

    const rowsWithOrderId = orderItemRows.map((r) => ({ ...r, order_id: order.id }));
    const { error: itemsErr } = await supabase.from('order_items').insert(rowsWithOrderId);
    if (itemsErr) {
      console.error('Order items insert failed:', itemsErr);
      await supabase.from('orders').delete().eq('id', order.id);
      return json({ error: 'Failed to create order items' }, 500);
    }

    return json({
      order_id: order.id,
      subtotal,
      shipping_cost: shippingCost,
      discount,
      total,
    });
  } catch (err) {
    console.error('place-order error:', err);
    return json({ error: 'An internal error occurred. Please try again.' }, 500);
  }
});
