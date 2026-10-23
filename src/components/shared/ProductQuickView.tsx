import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ShoppingCart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProduct, mapVariant } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { variantLabel } from '@/types';

export default function ProductQuickView({ slug, open, onOpenChange }: { slug: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { data: product, isLoading, isError } = useProduct(open ? slug : '');
  const { addToCart } = useCart();
  const [variantId, setVariantId] = useState('');
  const [imageIndex, setImageIndex] = useState(0);
  const variants = useMemo(() => (product?.product_variants || []).map(mapVariant), [product]);
  const variant = variants.find(v => v.id === variantId) || variants.find(v => v.stock > 0) || variants[0] || null;
  const images = variant?.images.length ? variant.images : (product?.product_images || []).slice().sort((a,b) => a.sort_order-b.sort_order).map(i => i.url);
  const price = variant ? variant.discountPrice ?? variant.price : product?.discount_price ?? product?.price ?? 0;
  const compareAt = variant?.discountPrice != null ? variant.price : !variant && product?.discount_price != null ? product.price : null;
  const stock = variant?.stock ?? product?.stock ?? 0;
  const add = () => {
    if (!product || stock <= 0) return;
    addToCart({
      id: product.id, name: product.name, slug: product.slug, description: product.description || '',
      shortDescription: product.short_description || '', price: product.price, discountPrice: product.discount_price ?? undefined,
      stock: product.stock, sku: product.sku || '', brandId: product.brand_id || '', categoryId: product.category_id || '',
      images: product.product_images.map(i => i.url), specifications: product.specifications, rating: product.rating,
      reviewCount: product.review_count, isFeatured: product.is_featured, isNew: product.is_new, isBestSeller: product.is_best_seller, createdAt: product.created_at,
    }, 1, variant);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{product?.name || 'Quick View'}</DialogTitle><DialogDescription>{product?.brands?.name || 'Product details'}</DialogDescription></DialogHeader>
      {isLoading ? <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : isError || !product ?
        <p className="text-muted-foreground py-8">This product is unavailable. Please try again.</p> : <>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="aspect-square bg-secondary/50 rounded-lg overflow-hidden"><img src={images[imageIndex] || images[0] || '/placeholder.svg'} alt={product.name} className="w-full h-full object-contain" /></div>
            <div className="flex flex-wrap gap-2 mt-3">{images.map((url,index) => <Button key={`${url}:${index}`} size="icon" variant="outline" aria-label={`View image ${index + 1}`} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)} className={`h-14 w-14 p-1 ${imageIndex === index ? 'border-primary' : ''}`}><img src={url} alt="" className="w-full h-full object-contain" /></Button>)}</div>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-3 mb-4"><span className="font-display text-3xl font-bold">${price.toLocaleString()}</span>{compareAt != null && <span className="text-muted-foreground line-through">${compareAt.toLocaleString()}</span>}</div>
            {product.short_description && <div className="prose prose-sm dark:prose-invert max-w-none break-words mb-5" dangerouslySetInnerHTML={{ __html: product.short_description }} />}
            {variants.length > 0 && <div className="mb-5"><h3 className="text-sm font-medium mb-2">Color / Storage</h3><div className="flex flex-wrap gap-2">{variants.map(v => <Button key={v.id} variant={variant?.id === v.id ? 'default' : 'outline'} aria-pressed={variant?.id === v.id} onClick={() => { setVariantId(v.id); setImageIndex(0); }} className="h-auto py-2 whitespace-normal text-left"><span>{variantLabel(v) || v.sku || 'Standard'} · ${(v.discountPrice ?? v.price).toLocaleString()}{v.stock <= 0 && ' · Sold out'}</span></Button>)}</div></div>}
            <Badge variant={stock > 0 ? 'secondary' : 'destructive'}>{stock > 0 ? `${stock} in stock` : 'Out of stock'}</Badge>
            {variant?.sku && <p className="text-xs text-muted-foreground mt-2">SKU: {variant.sku}</p>}
            <div className="flex flex-wrap gap-2 mt-6"><Button onClick={add} disabled={stock <= 0}><ShoppingCart className="h-4 w-4 mr-2" />Add to Cart</Button><Button asChild variant="outline"><Link to={`/product/${slug}`}>View full details</Link></Button></div>
          </div>
        </div>
        <section className="border-t pt-5"><h3 className="font-display font-semibold mb-3">Description</h3>{product.description ? <div className="prose prose-sm dark:prose-invert max-w-none break-words" dangerouslySetInnerHTML={{ __html: product.description }} /> : <p className="text-muted-foreground">No description available.</p>}</section>
      </>}
    </DialogContent>
  </Dialog>;
}