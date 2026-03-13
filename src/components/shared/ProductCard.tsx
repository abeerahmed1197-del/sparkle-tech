import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductWithImages } from '@/hooks/useProducts';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface ProductCardProps {
  product: ProductWithImages;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const cardRef = useRef<HTMLDivElement>(null);
  const inWishlist = isInWishlist(product.id);
  const discount = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const mainImage = product.product_images?.[0]?.url || '/placeholder.svg';

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: cardRef.current }
      );
    }
  }, []);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      shortDescription: product.short_description || '',
      price: product.price,
      discountPrice: product.discount_price ?? undefined,
      stock: product.stock,
      sku: product.sku || '',
      brandId: product.brand_id || '',
      categoryId: product.category_id || '',
      images: product.product_images?.map(i => i.url) || [],
      specifications: product.specifications || {},
      rating: product.rating,
      reviewCount: product.review_count,
      isFeatured: product.is_featured,
      isNew: product.is_new,
      isBestSeller: product.is_best_seller,
      createdAt: product.created_at,
    });
  };

  return (
    <Card ref={cardRef} className="group overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 bg-card">
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        <Link to={`/product/${product.slug}`}>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_new && <Badge className="bg-primary text-primary-foreground text-[10px] border-0 shadow-lg">NEW</Badge>}
          {discount > 0 && <Badge className="bg-accent text-accent-foreground text-[10px] border-0 shadow-lg">-{discount}%</Badge>}
          {product.is_best_seller && <Badge variant="secondary" className="text-[10px] border-0 shadow-lg">BEST SELLER</Badge>}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full shadow-elevation-2 backdrop-blur-sm"
            onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist({
              id: product.id, name: product.name, slug: product.slug,
              description: product.description || '', shortDescription: product.short_description || '',
              price: product.price, discountPrice: product.discount_price ?? undefined,
              stock: product.stock, sku: product.sku || '', brandId: product.brand_id || '',
              categoryId: product.category_id || '', images: product.product_images?.map(i => i.url) || [],
              specifications: product.specifications || {}, rating: product.rating,
              reviewCount: product.review_count, isFeatured: product.is_featured,
              isNew: product.is_new, isBestSeller: product.is_best_seller, createdAt: product.created_at,
            })}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-destructive text-destructive' : ''}`} />
          </Button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
          <Button
            size="sm"
            className="w-full shadow-elevation-2 backdrop-blur-sm"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-1.5" /> Add to Cart
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <Link to={`/product/${product.slug}`} className="block">
          {product.brands && (
            <p className="text-[11px] text-muted-foreground mb-1 uppercase tracking-widest font-medium">{product.brands.name}</p>
          )}
          <h3 className="font-display font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-warning text-warning' : 'text-muted-foreground/20'}`} />
          ))}
          <span className="text-[11px] text-muted-foreground ml-1">({product.review_count})</span>
        </div>

        <div className="flex items-center gap-2">
          {product.discount_price ? (
            <>
              <span className="font-display font-bold text-lg">${product.discount_price}</span>
              <span className="text-sm text-muted-foreground line-through">${product.price}</span>
            </>
          ) : (
            <span className="font-display font-bold text-lg">${product.price}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
