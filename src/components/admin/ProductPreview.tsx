import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Heart, Truck, Shield, RotateCcw, Star, Minus, Plus, Check } from 'lucide-react';
import { useMemo, useState } from 'react';

interface PreviewProduct {
  name: string;
  short_description: string;
  description: string;
  price: number;
  discount_price: number | null;
  stock: number;
  sku: string;
  categoryName?: string;
  brandName?: string;
  is_new: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  images: string[];
  variants: {
    color: string;
    color_hex: string;
    storage: string;
    price: number;
    discount_price: number | null;
    stock: number;
    images: string[];
  }[];
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: PreviewProduct;
}

const ProductPreview = ({ open, onOpenChange, product }: Props) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);

  const colorOptions = useMemo(() => {
    const seen = new Map<string, string>();
    product.variants.forEach(v => { if (v.color && !seen.has(v.color)) seen.set(v.color, v.color_hex || '#888'); });
    return Array.from(seen.entries()).map(([color, hex]) => ({ color, hex }));
  }, [product.variants]);

  const storageOptions = useMemo(() => {
    const filtered = selectedColor ? product.variants.filter(v => v.color === selectedColor) : product.variants;
    const set = new Set<string>();
    filtered.forEach(v => v.storage && set.add(v.storage));
    return Array.from(set);
  }, [product.variants, selectedColor]);

  const selectedVariant = useMemo(() => {
    if (!product.variants.length) return null;
    return product.variants.find(v =>
      (selectedColor ? v.color === selectedColor : !v.color) &&
      (selectedStorage ? v.storage === selectedStorage : !v.storage),
    ) || null;
  }, [product.variants, selectedColor, selectedStorage]);

  const gallery = selectedVariant?.images.length ? selectedVariant.images : product.images;
  const mainImage = gallery[selectedImage] || gallery[0] || '/placeholder.svg';
  const currentPrice = selectedVariant
    ? (selectedVariant.discount_price ?? selectedVariant.price)
    : (product.discount_price ?? product.price);
  const compareAt = selectedVariant
    ? (selectedVariant.discount_price ? selectedVariant.price : null)
    : (product.discount_price ? product.price : null);
  const discount = compareAt ? Math.round(((compareAt - currentPrice) / compareAt) * 100) : 0;
  const stock = selectedVariant ? selectedVariant.stock : product.stock;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Preview
            <Badge variant="outline" className="text-xs">Not published</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-8 mt-2">
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-secondary/50 mb-4">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {gallery.map((url, i) => (
                  <button key={url + i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${i === selectedImage ? 'border-primary' : 'border-transparent opacity-60'}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              {product.brandName && <Badge variant="secondary">{product.brandName}</Badge>}
              {product.is_new && <Badge className="bg-primary text-primary-foreground border-0">NEW</Badge>}
              {product.is_best_seller && <Badge className="bg-accent text-accent-foreground border-0">BESTSELLER</Badge>}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-3">{product.name || 'Untitled product'}</h1>
            {product.short_description && (
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mb-4" dangerouslySetInnerHTML={{ __html: product.short_description }} />
            )}

            <div className="flex items-center gap-2 mb-5">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 text-muted-foreground/20" />)}</div>
              <span className="text-sm text-muted-foreground">No reviews yet</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-4xl font-bold">${currentPrice.toLocaleString()}</span>
              {compareAt && (<>
                <span className="text-lg text-muted-foreground line-through">${compareAt.toLocaleString()}</span>
                {discount > 0 && <Badge className="bg-accent text-accent-foreground border-0">Save {discount}%</Badge>}
              </>)}
            </div>

            {colorOptions.length > 0 && (
              <div className="mb-5">
                <div className="flex items-baseline justify-between mb-2">
                  <p className="text-sm font-medium">Color</p>
                  {selectedColor && <span className="text-sm text-muted-foreground">{selectedColor}</span>}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {colorOptions.map(opt => {
                    const active = selectedColor === opt.color;
                    return (
                      <button key={opt.color} onClick={() => setSelectedColor(opt.color)}
                        className={`relative h-10 w-10 rounded-full border-2 transition ${active ? 'border-primary ring-2 ring-primary/30' : 'border-border'}`}
                        style={{ background: opt.hex }}>
                        {active && <Check className="absolute inset-0 m-auto h-4 w-4 text-white mix-blend-difference" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {storageOptions.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Storage</p>
                <div className="flex flex-wrap gap-2">
                  {storageOptions.map(opt => (
                    <button key={opt} onClick={() => setSelectedStorage(opt)}
                      className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition ${selectedStorage === opt ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-6" />

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-xl overflow-hidden">
                <Button variant="ghost" size="icon" className="rounded-none"><Minus className="h-4 w-4" /></Button>
                <span className="w-14 text-center font-medium">1</span>
                <Button variant="ghost" size="icon" className="rounded-none"><Plus className="h-4 w-4" /></Button>
              </div>
              <span className="text-sm text-muted-foreground">{stock} in stock</span>
            </div>

            <div className="flex gap-3 mb-8">
              <Button size="lg" className="flex-1 h-12" disabled><ShoppingCart className="h-4 w-4 mr-2" />Add to Cart</Button>
              <Button size="lg" variant="outline" className="h-12" disabled><Heart className="h-4 w-4" /></Button>
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

        <Tabs defaultValue="description" className="mt-10">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            {product.description ? (
              <div className="prose dark:prose-invert max-w-3xl" dangerouslySetInnerHTML={{ __html: product.description }} />
            ) : (
              <p className="text-muted-foreground">No description yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreview;
