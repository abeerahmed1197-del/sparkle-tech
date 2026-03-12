import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-6">Save items you love for later.</p>
          <Button asChild><Link to="/shop">Browse Products</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-8 pb-16">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">Wishlist ({items.length})</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(product => (
            <Card key={product.id} className="border-0 shadow-card">
              <CardContent className="p-4 flex gap-4">
                <Link to={`/product/${product.slug}`} className="shrink-0">
                  <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-cover rounded-xl" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${product.slug}`} className="font-display font-semibold text-sm hover:text-primary line-clamp-2">{product.name}</Link>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-bold">${product.discountPrice ?? product.price}</span>
                    {product.discountPrice && <span className="text-xs text-muted-foreground line-through">${product.price}</span>}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1" onClick={() => addToCart(product)}>
                      <ShoppingCart className="h-3 w-3 mr-1" /> Add to Cart
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removeFromWishlist(product.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
