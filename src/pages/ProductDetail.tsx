import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Minus, Plus, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/shared/ProductCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { products } from '@/data/products';
import { categories, brands } from '@/data/categories';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Product Not Found</h1>
          <Button asChild><Link to="/shop">Back to Shop</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const brand = brands.find(b => b.id === product.brandId);
  const category = categories.find(c => c.id === product.categoryId);
  const inWishlist = isInWishlist(product.id);
  const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const relatedProducts = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link><span>/</span>
          <Link to="/shop" className="hover:text-foreground">Shop</Link><span>/</span>
          {category && <><Link to={`/shop?category=${category.slug}`} className="hover:text-foreground">{category.name}</Link><span>/</span></>}
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <div className="container pb-16">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary mb-4">
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-primary' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {brand && <Badge variant="secondary">{brand.name}</Badge>}
              {product.isNew && <Badge className="bg-primary text-primary-foreground">NEW</Badge>}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground mb-4">{product.shortDescription}</p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-warning text-warning' : 'text-border'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              {product.discountPrice ? (
                <>
                  <span className="font-display text-3xl font-bold">${product.discountPrice}</span>
                  <span className="text-lg text-muted-foreground line-through">${product.price}</span>
                  <Badge className="bg-accent text-accent-foreground">Save {discount}%</Badge>
                </>
              ) : (
                <span className="font-display text-3xl font-bold">${product.price}</span>
              )}
            </div>

            <Separator className="my-6" />

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
              </div>
              <span className="text-sm text-muted-foreground">{product.stock} in stock</span>
            </div>

            <div className="flex gap-3 mb-8">
              <Button size="lg" className="flex-1" onClick={() => addToCart(product, quantity)}>
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}>
                <Heart className={`h-4 w-4 ${inWishlist ? 'fill-destructive text-destructive' : ''}`} />
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { icon: Truck, text: 'Free shipping on orders over $50' },
                { icon: Shield, text: '2-year warranty included' },
                { icon: RotateCcw, text: '30-day return policy' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary" />{text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mt-12">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <p className="text-muted-foreground leading-relaxed max-w-3xl">{product.description}</p>
          </TabsContent>
          <TabsContent value="specs" className="mt-6">
            <div className="max-w-lg space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b">
                  <span className="font-medium">{key}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <p className="text-muted-foreground">Reviews will be loaded from the database once Supabase is connected.</p>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
