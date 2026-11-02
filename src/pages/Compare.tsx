import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Star, X, Loader2, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCompare } from '@/context/CompareContext';
import { useCompareProducts, mapVariant, type ProductWithImages } from '@/hooks/useProducts';
import { collectSpecKeys, specRowDiffers } from '@/lib/compare';
import { usePageSeo } from '@/hooks/usePageSeo';

const basePrice = (p: ProductWithImages) => p.discount_price ?? p.price;

const storageSummary = (p: ProductWithImages): [string, number][] => {
  const byStorage = new Map<string, number>();
  (p.product_variants || []).forEach(raw => {
    const v = mapVariant(raw);
    if (!v.storage) return;
    byStorage.set(v.storage, Math.min(byStorage.get(v.storage) ?? Infinity, v.discountPrice ?? v.price));
  });
  return Array.from(byStorage.entries());
};

const colorSummary = (p: ProductWithImages): [string, string | null][] => {
  const seen = new Map<string, string | null>();
  (p.product_variants || []).forEach(raw => {
    const v = mapVariant(raw);
    if (v.color && !seen.has(v.color)) seen.set(v.color, v.colorHex);
  });
  return Array.from(seen.entries());
};

const Compare = () => {
  const { ids, removeCompare, clearCompare } = useCompare();
  const { data: products, isLoading } = useCompareProducts(ids);

  usePageSeo(
    'Compare Products — eMobiles',
    'Compare specifications, prices and variants of your selected products side by side.',
    '/compare',
    [{ name: 'Home', path: '/' }, { name: 'Compare', path: '/compare' }],
  );

  if (ids.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-24 text-center">
          <Scale className="h-12 w-12 text-muted-foreground/40 mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold mb-3">Nothing to compare yet</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Tap the compare icon on any product in the shop, then return here to see specifications, prices and variants side by side.
          </p>
          <Button asChild size="lg">
            <Link to="/shop">Browse the Shop</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const specs = (products || []).map(p => p.specifications || {});
  const specKeys = collectSpecKeys(specs);
  const bestPrice = products && products.length > 0 ? Math.min(...products.map(basePrice)) : null;

  const rows: { label: string; render: (p: ProductWithImages) => ReactNode; differs?: boolean }[] = [
    {
      label: 'Price',
      render: p => (
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-bold">${basePrice(p).toLocaleString()}</span>
          {p.discount_price && <span className="text-sm text-muted-foreground line-through">${p.price.toLocaleString()}</span>}
          {bestPrice !== null && basePrice(p) === bestPrice && (
            <Badge variant="secondary" className="text-[10px] gap-1"><Check className="h-3 w-3" />Best price</Badge>
          )}
        </div>
      ),
    },
    {
      label: 'Rating',
      render: p => (
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(p.rating) ? 'fill-warning text-warning' : 'text-muted-foreground/20'}`} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{p.rating} ({p.review_count})</span>
        </div>
      ),
    },
    {
      label: 'Availability',
      render: p => (
        <span className={p.stock > 0 ? 'text-sm' : 'text-sm text-destructive'}>
          {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
        </span>
      ),
    },
    {
      label: 'Colors',
      render: p => {
        const colors = colorSummary(p);
        if (!colors.length) return <span className="text-sm text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1.5 items-center">
            {colors.map(([color, hex]) => (
              <span key={color} className="flex items-center gap-1.5 text-xs">
                <span className="h-4 w-4 rounded-full border inline-block" style={{ background: hex || '#888' }} title={color} />
                {color}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      label: 'Storage & price',
      render: p => {
        const storages = storageSummary(p);
        if (!storages.length) return <span className="text-sm text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1.5">
            {storages.map(([storage, price]) => (
              <span key={storage} className="text-xs rounded-lg border px-2 py-1 bg-muted/40">
                {storage} · ${price.toLocaleString()}
              </span>
            ))}
          </div>
        );
      },
    },
    ...specKeys.map(key => ({
      label: key,
      differs: specRowDiffers(specs, key),
      render: (p: ProductWithImages) => (
        <span className="text-sm">{String(p.specifications?.[key] ?? '—')}</span>
      ),
    })),
    {
      label: '',
      render: p => (
        <Button asChild variant="outline" size="sm">
          <Link to={`/product/${p.slug}`}>
            View product <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Compare</span>
        </div>
      </div>

      <div className="container pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Compare Products</h1>
            <p className="text-muted-foreground mt-1">{(products || []).length} of {ids.length} selected products</p>
          </div>
          <Button variant="outline" onClick={clearCompare}>
            <X className="h-4 w-4 mr-1.5" /> Clear all
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">The selected products are no longer available.</p>
            <Button variant="outline" onClick={clearCompare}>Clear selection</Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border bg-card shadow-card">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-card z-10 w-36 p-4 text-left font-medium text-muted-foreground align-top">Compare</th>
                  {products.map(p => (
                    <th key={p.id} className="p-4 align-top text-left font-normal min-w-[210px]">
                      <div className="relative group">
                        <button
                          onClick={() => removeCompare(p.id)}
                          aria-label={`Remove ${p.name} from compare`}
                          className="absolute top-1 right-1 h-7 w-7 rounded-full bg-secondary flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <Link to={`/product/${p.slug}`} className="block mb-3">
                          <img
                            src={p.product_images?.[0]?.url || '/placeholder.svg'}
                            alt={p.name}
                            className="w-full aspect-square object-cover rounded-xl mb-3"
                          />
                        </Link>
                        {p.brands && <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{p.brands.name}</p>}
                        <Link to={`/product/${p.slug}`} className="font-display font-semibold leading-tight hover:text-primary transition-colors line-clamp-2">
                          {p.name}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label || i} className={row.differs ? 'bg-primary/5' : undefined}>
                    <td className="sticky left-0 z-10 p-4 align-top font-medium border-t border-border/60 bg-card w-36">
                      {row.label}
                      {row.differs && <span className="block mt-1 text-[10px] uppercase tracking-wider text-primary font-semibold">Different</span>}
                    </td>
                    {products.map(p => (
                      <td key={p.id} className="p-4 align-top border-t border-border/60">
                        {row.render(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Compare;
