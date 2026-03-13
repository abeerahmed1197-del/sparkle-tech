import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import ProductCard from '@/components/shared/ProductCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useProduct, useProducts, useReviews } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import gsap from 'gsap';

const ProductDetail = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug!);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const { data: reviews, refetch: refetchReviews } = useReviews(product?.id || '');
  const { data: relatedProducts } = useProducts({
    categorySlug: product?.categories?.slug,
    limit: 4,
  });

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [slug]);

  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(imageRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' });
    }
  }, [selectedImage]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

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

  const images = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) || [];
  const mainImage = images[selectedImage]?.url || '/placeholder.svg';
  const inWishlist = isInWishlist(product.id);
  const discount = product.discount_price ? Math.round(((product.price - product.discount_price) / product.price) * 100) : 0;
  const related = relatedProducts?.filter(p => p.id !== product.id).slice(0, 4) || [];

  const productLegacy = {
    id: product.id, name: product.name, slug: product.slug,
    description: product.description || '', shortDescription: product.short_description || '',
    price: product.price, discountPrice: product.discount_price ?? undefined,
    stock: product.stock, sku: product.sku || '', brandId: product.brand_id || '',
    categoryId: product.category_id || '', images: images.map(i => i.url),
    specifications: product.specifications || {}, rating: product.rating,
    reviewCount: product.review_count, isFeatured: product.is_featured,
    isNew: product.is_new, isBestSeller: product.is_best_seller, createdAt: product.created_at,
  };

  const handleSubmitReview = async () => {
    if (!user) { toast.error('Please log in to leave a review'); return; }
    setSubmittingReview(true);
    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      product_id: product.id,
      rating: reviewRating,
      comment: reviewComment,
    });
    if (error) {
      toast.error(error.code === '23505' ? 'You already reviewed this product' : 'Failed to submit review');
    } else {
      toast.success('Review submitted!');
      setReviewComment('');
      refetchReviews();
    }
    setSubmittingReview(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
          <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link><span>/</span>
          {product.categories && <><Link to={`/shop?category=${product.categories.slug}`} className="hover:text-foreground transition-colors">{product.categories.name}</Link><span>/</span></>}
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <div className="container pb-20">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-14">
          {/* Images */}
          <div>
            <div ref={imageRef} className="aspect-square rounded-3xl overflow-hidden bg-secondary/50 mb-4">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button key={img.id} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${i === selectedImage ? 'border-primary shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {product.brands && <Badge variant="secondary" className="font-medium">{product.brands.name}</Badge>}
              {product.is_new && <Badge className="bg-primary text-primary-foreground border-0">NEW</Badge>}
            </div>
            <h1 className="font-display text-2xl md:text-4xl font-bold mb-3">{product.name}</h1>
            <p className="text-muted-foreground mb-4">{product.short_description}</p>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-warning text-warning' : 'text-muted-foreground/20'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.review_count} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              {product.discount_price ? (
                <>
                  <span className="font-display text-4xl font-bold">${product.discount_price}</span>
                  <span className="text-lg text-muted-foreground line-through">${product.price}</span>
                  <Badge className="bg-accent text-accent-foreground border-0">Save {discount}%</Badge>
                </>
              ) : (
                <span className="font-display text-4xl font-bold">${product.price}</span>
              )}
            </div>

            <Separator className="my-6" />

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-xl overflow-hidden">
                <Button variant="ghost" size="icon" className="rounded-none" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-14 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" className="rounded-none" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
              </div>
              <span className="text-sm text-muted-foreground">{product.stock} in stock</span>
            </div>

            <div className="flex gap-3 mb-8">
              <Button size="lg" className="flex-1 h-12" onClick={() => addToCart(productLegacy, quantity)}>
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="h-12" onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(productLegacy)}>
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
        <Tabs defaultValue="description" className="mt-14">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews?.length || 0})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <p className="text-muted-foreground leading-relaxed max-w-3xl">{product.description}</p>
          </TabsContent>
          <TabsContent value="specs" className="mt-6">
            <div className="max-w-lg space-y-3">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 border-b border-border/50">
                  <span className="font-medium">{key}</span>
                  <span className="text-muted-foreground">{String(value)}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="max-w-2xl space-y-6">
              {reviews?.map((review: any) => (
                <div key={review.id} className="pb-6 border-b border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-warning text-warning' : 'text-muted-foreground/20'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{review.profiles?.full_name || 'Anonymous'}</span>
                    <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                </div>
              ))}

              {/* Add review */}
              <div className="pt-4">
                <h4 className="font-display font-semibold mb-4">Leave a Review</h4>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} onClick={() => setReviewRating(i + 1)}>
                      <Star className={`h-5 w-5 transition-colors ${i < reviewRating ? 'fill-warning text-warning' : 'text-muted-foreground/30 hover:text-warning/50'}`} />
                    </button>
                  ))}
                </div>
                <Textarea placeholder="Share your experience..." value={reviewComment} onChange={e => setReviewComment(e.target.value)} className="mb-3" />
                <Button onClick={handleSubmitReview} disabled={submittingReview}>
                  {submittingReview ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Submit Review
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
