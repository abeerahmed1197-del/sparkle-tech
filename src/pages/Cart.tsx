import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
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
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const price = item.product.discountPrice ?? item.product.price;
              return (
                <Card key={item.product.id} className="border-0 shadow-card">
                  <CardContent className="p-4 flex gap-4">
                    <Link to={`/product/${item.product.slug}`} className="shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product.slug}`} className="font-display font-semibold hover:text-primary transition-colors line-clamp-1">{item.product.name}</Link>
                      <p className="text-sm text-muted-foreground">{item.product.shortDescription}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded-lg">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-display font-bold">${(price * item.quantity).toFixed(2)}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div>
            <Card className="border-0 shadow-card sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
                  <Separator />
                  <div className="flex justify-between font-display font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Input placeholder="Coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="h-9" />
                  <Button variant="outline" size="sm">Apply</Button>
                </div>
                <Button className="w-full mt-4" size="lg" asChild>
                  <Link to="/checkout">Checkout <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button variant="ghost" className="w-full mt-2" asChild>
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
