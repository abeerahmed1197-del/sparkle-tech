import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { shippingMethods } from '@/data/products';
import { toast } from 'sonner';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [shippingMethod, setShippingMethod] = useState(shippingMethods[0].id);
  const selectedShipping = shippingMethods.find(s => s.id === shippingMethod)!;
  const shipping = subtotal >= 50 && selectedShipping.price > 0 ? 0 : selectedShipping.price;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    toast.success('Order placed successfully! (Demo - Stripe integration pending)');
    clearCart();
    navigate('/order-success');
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-8 pb-16">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <Card className="border-0 shadow-card">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-lg mb-4">Shipping Address</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>First Name</Label><Input className="mt-1" /></div>
                  <div><Label>Last Name</Label><Input className="mt-1" /></div>
                  <div className="sm:col-span-2"><Label>Address</Label><Input className="mt-1" /></div>
                  <div><Label>City</Label><Input className="mt-1" /></div>
                  <div><Label>State</Label><Input className="mt-1" /></div>
                  <div><Label>ZIP Code</Label><Input className="mt-1" /></div>
                  <div><Label>Phone</Label><Input className="mt-1" /></div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card className="border-0 shadow-card">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-lg mb-4">Shipping Method</h3>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                  {shippingMethods.map(method => (
                    <label key={method.id} className="flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={method.id} />
                        <div>
                          <p className="font-medium text-sm">{method.name}</p>
                          <p className="text-xs text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-sm">{method.price === 0 ? 'FREE' : `$${method.price}`}</span>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card className="border-0 shadow-card">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-lg mb-4">Payment</h3>
                <p className="text-sm text-muted-foreground">Stripe checkout will be integrated here. Connect your Supabase and Stripe accounts to enable payments.</p>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="border-0 shadow-card sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
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
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
                  <Separator />
                  <div className="flex justify-between font-display font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>
                <Button className="w-full mt-6" size="lg" onClick={handlePlaceOrder}>Place Order</Button>
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
