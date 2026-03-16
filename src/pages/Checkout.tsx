import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useShippingMethods, useAddresses } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, MapPin, Truck, CreditCard, Check } from 'lucide-react';

const steps = ['Address', 'Shipping', 'Review & Pay'];

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: shippingMethods } = useShippingMethods();
  const { data: savedAddresses } = useAddresses();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);

  // Address form
  const [addressForm, setAddressForm] = useState({
    name: '', phone: '', street: '', city: '', state: '', zip: '', country: 'US',
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(true);

  // Shipping
  const [shippingMethodId, setShippingMethodId] = useState('');
  const selectedShipping = shippingMethods?.find(s => s.id === shippingMethodId);
  const shippingCost = selectedShipping ? (subtotal >= 50 && selectedShipping.price > 0 ? 0 : selectedShipping.price) : 0;

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const total = subtotal - couponDiscount + shippingCost;

  useEffect(() => {
    if (shippingMethods?.length && !shippingMethodId) {
      setShippingMethodId(shippingMethods[0].id);
    }
  }, [shippingMethods, shippingMethodId]);

  useEffect(() => {
    if (!user) navigate('/auth?redirect=/checkout');
  }, [user, navigate]);

  const handleSelectAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    const addr = savedAddresses?.find(a => a.id === addrId);
    if (addr) {
      setAddressForm({
        name: addr.name, phone: addr.phone || '', street: addr.street,
        city: addr.city, state: addr.state || '', zip: addr.zip, country: addr.country,
      });
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (!coupon) {
      toast.error('Invalid or expired coupon');
      setApplyingCoupon(false);
      return;
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      toast.error('Coupon has expired');
      setApplyingCoupon(false);
      return;
    }

    if (coupon.min_order_amount && subtotal < Number(coupon.min_order_amount)) {
      toast.error(`Minimum order amount is $${coupon.min_order_amount}`);
      setApplyingCoupon(false);
      return;
    }

    if (coupon.max_uses && coupon.used_count && coupon.used_count >= coupon.max_uses) {
      toast.error('Coupon usage limit reached');
      setApplyingCoupon(false);
      return;
    }

    const discount = coupon.discount_type === 'percentage'
      ? subtotal * (Number(coupon.discount_value) / 100)
      : Number(coupon.discount_value);

    setCouponDiscount(Math.min(discount, subtotal));
    setAppliedCoupon(coupon.code);
    toast.success(`Coupon applied! You save $${Math.min(discount, subtotal).toFixed(2)}`);
    setApplyingCoupon(false);
  };

  const handlePlaceOrder = async () => {
    if (!user) return;
    setPlacing(true);

    try {
      // Save address if needed
      let addressId = selectedAddressId;
      if (saveAddress && !selectedAddressId) {
        const { data: newAddr, error: addrErr } = await supabase
          .from('addresses')
          .insert({
            user_id: user.id,
            name: addressForm.name,
            phone: addressForm.phone,
            street: addressForm.street,
            city: addressForm.city,
            state: addressForm.state,
            zip: addressForm.zip,
            country: addressForm.country,
            is_default: !savedAddresses?.length,
          })
          .select()
          .single();
        if (addrErr) throw addrErr;
        addressId = newAddr.id;
      }

      // Create order
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          subtotal,
          shipping_cost: shippingCost,
          discount: couponDiscount,
          total,
          status: 'pending',
          shipping_address_id: addressId,
          shipping_method_id: shippingMethodId || null,
          coupon_code: appliedCoupon,
        })
        .select()
        .single();
      if (orderErr) throw orderErr;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images[0] || null,
        price: item.product.discountPrice ?? item.product.price,
        quantity: item.quantity,
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
      if (itemsErr) throw itemsErr;

      // Update coupon usage
      if (appliedCoupon) {
        supabase
          .from('coupons')
          .update({ used_count: 1 })
          .eq('code', appliedCoupon)
          .then(() => {});
      }

      // Try Stripe checkout
      try {
        const { data: stripeData, error: stripeError } = await supabase.functions.invoke('create-checkout', {
          body: {
            orderId: order.id,
            successUrl: `${window.location.origin}/order-success?order=${order.id}`,
            cancelUrl: `${window.location.origin}/checkout`,
          },
        });

        if (!stripeError && stripeData?.url) {
          // Redirect to Stripe
          await clearCart();
          window.location.href = stripeData.url;
          return;
        }
      } catch {
        // Stripe not configured — fall back to direct order
        console.log('Stripe not configured, placing order directly');
      }

      // Fallback: mark as placed without payment
      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-success?order=' + order.id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    }
    setPlacing(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button asChild><Link to="/shop">Continue Shopping</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const canProceedAddress = addressForm.name && addressForm.street && addressForm.city && addressForm.zip;
  const canProceedShipping = !!shippingMethodId;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-8 pb-16">
        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  i === step ? 'bg-primary text-primary-foreground' :
                  i < step ? 'bg-primary/10 text-primary cursor-pointer' :
                  'bg-secondary text-muted-foreground'
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : <span>{i + 1}</span>}
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 0: Address */}
            {step === 0 && (
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-display font-semibold text-lg">Shipping Address</h3>
                  </div>

                  {savedAddresses && savedAddresses.length > 0 && (
                    <div className="mb-6">
                      <Label className="mb-2 block">Saved Addresses</Label>
                      <Select value={selectedAddressId || ''} onValueChange={handleSelectAddress}>
                        <SelectTrigger><SelectValue placeholder="Select a saved address" /></SelectTrigger>
                        <SelectContent>
                          {savedAddresses.map(a => (
                            <SelectItem key={a.id} value={a.id}>
                              {a.name} — {a.street}, {a.city} {a.zip}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Separator className="my-4" />
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><Label>Full Name</Label><Input className="mt-1" value={addressForm.name} onChange={e => setAddressForm(p => ({ ...p, name: e.target.value }))} /></div>
                    <div><Label>Phone</Label><Input className="mt-1" value={addressForm.phone} onChange={e => setAddressForm(p => ({ ...p, phone: e.target.value }))} /></div>
                    <div className="sm:col-span-2"><Label>Street Address</Label><Input className="mt-1" value={addressForm.street} onChange={e => setAddressForm(p => ({ ...p, street: e.target.value }))} /></div>
                    <div><Label>City</Label><Input className="mt-1" value={addressForm.city} onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))} /></div>
                    <div><Label>State</Label><Input className="mt-1" value={addressForm.state} onChange={e => setAddressForm(p => ({ ...p, state: e.target.value }))} /></div>
                    <div><Label>ZIP Code</Label><Input className="mt-1" value={addressForm.zip} onChange={e => setAddressForm(p => ({ ...p, zip: e.target.value }))} /></div>
                    <div><Label>Country</Label><Input className="mt-1" value={addressForm.country} onChange={e => setAddressForm(p => ({ ...p, country: e.target.value }))} /></div>
                  </div>

                  <label className="flex items-center gap-2 mt-4 text-sm">
                    <input type="checkbox" checked={saveAddress} onChange={e => setSaveAddress(e.target.checked)} className="rounded border-input" />
                    Save this address for future orders
                  </label>

                  <Button className="mt-6" onClick={() => setStep(1)} disabled={!canProceedAddress}>
                    Continue to Shipping
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 1: Shipping */}
            {step === 1 && (
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Truck className="h-5 w-5 text-primary" />
                    <h3 className="font-display font-semibold text-lg">Shipping Method</h3>
                  </div>
                  {shippingMethods && shippingMethods.length > 0 ? (
                    <RadioGroup value={shippingMethodId} onValueChange={setShippingMethodId} className="space-y-3">
                      {shippingMethods.map(method => {
                        const isFree = subtotal >= 50 && method.price > 0;
                        return (
                          <label key={method.id} className="flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:bg-secondary/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={method.id} />
                              <div>
                                <p className="font-medium text-sm">{method.name}</p>
                                <p className="text-xs text-muted-foreground">{method.description} • {method.estimated_days}</p>
                              </div>
                            </div>
                            <span className="font-semibold text-sm">
                              {method.price === 0 || isFree ? (
                                <Badge variant="secondary" className="text-xs">FREE</Badge>
                              ) : `$${method.price}`}
                            </span>
                          </label>
                        );
                      })}
                    </RadioGroup>
                  ) : (
                    <p className="text-sm text-muted-foreground">No shipping methods available.</p>
                  )}
                  {subtotal < 50 && (
                    <p className="text-xs text-muted-foreground mt-3">💡 Add ${(50 - subtotal).toFixed(2)} more to qualify for free shipping!</p>
                  )}
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                    <Button onClick={() => setStep(2)} disabled={!canProceedShipping}>Continue to Review</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Review & Pay */}
            {step === 2 && (
              <div className="space-y-6">
                <Card className="border-0 shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <h3 className="font-display font-semibold text-lg">Review & Place Order</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Shipping to:</p>
                        <p className="text-sm text-muted-foreground">
                          {addressForm.name} • {addressForm.street}, {addressForm.city}, {addressForm.state} {addressForm.zip}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium mb-1">Shipping method:</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedShipping?.name} — {shippingCost === 0 ? 'FREE' : `$${shippingCost}`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-card">
                  <CardContent className="p-6">
                    <h3 className="font-display font-semibold mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {items.map(item => (
                        <div key={item.product.id} className="flex items-center gap-3">
                          <img src={item.product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-semibold">${((item.product.discountPrice ?? item.product.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-1" size="lg" onClick={handlePlaceOrder} disabled={placing}>
                    {placing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Place Order — ${total.toFixed(2)}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div>
            <Card className="border-0 shadow-card sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">{item.product.name} × {item.quantity}</span>
                      <span>${((item.product.discountPrice ?? item.product.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-primary"><span>Discount ({appliedCoupon})</span><span>-${couponDiscount.toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span></div>
                  <Separator />
                  <div className="flex justify-between font-display font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>

                {!appliedCoupon && (
                  <div className="flex gap-2 mt-4">
                    <Input placeholder="Coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="h-9" />
                    <Button variant="outline" size="sm" onClick={handleApplyCoupon} disabled={applyingCoupon}>
                      {applyingCoupon ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant="secondary">{appliedCoupon}</Badge>
                    <button className="text-xs text-destructive" onClick={() => { setAppliedCoupon(null); setCouponDiscount(0); setCouponCode(''); }}>Remove</button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
