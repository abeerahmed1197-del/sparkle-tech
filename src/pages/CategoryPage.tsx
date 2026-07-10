import { useMemo, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/shared/ProductCard';
import { useAllProducts, useCategoryTree, type CategoryNode } from '@/hooks/useProducts';

const setMeta = (title: string, description: string) => {
  document.title = title;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = description;
};

// Walk tree by slug path, return [node, breadcrumbTrail]
const resolvePath = (roots: CategoryNode[], segments: string[]): { node: CategoryNode; trail: CategoryNode[] } | null => {
  let currentList = roots;
  const trail: CategoryNode[] = [];
  let node: CategoryNode | null = null;
  for (const seg of segments) {
    const found = currentList.find(c => c.slug === seg);
    if (!found) return null;
    trail.push(found);
    node = found;
    currentList = found.children;
  }
  return node ? { node, trail } : null;
};

// Collect this node + all descendant slugs
const collectSlugs = (node: CategoryNode): string[] => {
  const out = [node.slug];
  node.children.forEach(c => out.push(...collectSlugs(c)));
  return out;
};

const CategoryPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const brandFilter = searchParams.get('brand');
  const { data: tree } = useCategoryTree();
  const { data: products, isLoading } = useAllProducts();

  // Path is everything after /c/
  const segments = useMemo(
    () => location.pathname.replace(/^\/c\/?/, '').split('/').filter(Boolean),
    [location.pathname],
  );

  const resolved = useMemo(() => (tree ? resolvePath(tree, segments) : null), [tree, segments]);
  const node = resolved?.node || null;
  const trail = resolved?.trail || [];

  const subtreeSlugs = useMemo(() => (node ? collectSlugs(node) : []), [node]);

  const productsInSubtree = useMemo(() => {
    if (!products || !node) return [];
    return products.filter(p => p.is_active && p.categories && subtreeSlugs.includes(p.categories.slug));
  }, [products, node, subtreeSlugs]);

  const brands = useMemo(() => {
    const map = new Map<string, { id: string; name: string; slug: string; logo: string | null; count: number }>();
    productsInSubtree.forEach(p => {
      if (!p.brands) return;
      const existing = map.get(p.brands.id);
      if (existing) existing.count += 1;
      else map.set(p.brands.id, { ...p.brands, count: 1 });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [productsInSubtree]);

  const filteredProducts = useMemo(() => {
    if (!brandFilter) return productsInSubtree;
    return productsInSubtree.filter(p => p.brands?.slug === brandFilter);
  }, [productsInSubtree, brandFilter]);

  const activeBrand = brandFilter ? brands.find(b => b.slug === brandFilter) : null;

  useEffect(() => {
    if (!node) return;
    const trailName = trail.map(t => t.name).join(' · ');
    const title = `${activeBrand ? `${activeBrand.name} ${node.name}` : node.name}${trailName && trailName !== node.name ? ` | ${trailName}` : ''} | eMobiles`;
    const desc = `Shop ${activeBrand ? activeBrand.name + ' ' : ''}${node.name.toLowerCase()} at eMobiles. ${filteredProducts.length} products with fast shipping and 30-day returns.`;
    setMeta(title.slice(0, 60), desc.slice(0, 160));
  }, [node, trail, activeBrand, filteredProducts.length]);

  if (!tree) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        <Footer />
      </div>
    );
  }

  if (!node) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Category Not Found</h1>
          <Link to="/categories" className="text-primary underline">Browse all categories</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const basePath = `/c/${trail.map(t => t.slug).join('/')}`;
  const showBrandGrid = !brandFilter && brands.length > 1 && node.children.length === 0;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-foreground">Home</Link><span>/</span>
          <Link to="/categories" className="hover:text-foreground">Categories</Link>
          {trail.map((t, i) => {
            const href = `/c/${trail.slice(0, i + 1).map(x => x.slug).join('/')}`;
            const isLast = i === trail.length - 1 && !activeBrand;
            return (
              <span key={t.id} className="flex items-center gap-2">
                <span>/</span>
                {isLast ? <span className="text-foreground">{t.name}</span> : <Link to={href} className="hover:text-foreground">{t.name}</Link>}
              </span>
            );
          })}
          {activeBrand && (
            <>
              <span>/</span>
              <span className="text-foreground">{activeBrand.name}</span>
            </>
          )}
        </nav>
      </div>

      <header className="container pt-2 pb-8">
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          {activeBrand ? `${activeBrand.name} ${node.name}` : node.name}
        </h1>
        <p className="text-muted-foreground mt-2">{filteredProducts.length} products</p>

        {node.children.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {node.children.map(c => (
              <Link
                key={c.id}
                to={`${basePath}/${c.slug}`}
                className="px-4 py-2 rounded-full border border-border bg-card text-sm font-medium hover:border-primary hover:text-primary transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {activeBrand && (
          <div className="mt-6">
            <Link to={basePath} className="text-sm text-primary hover:underline">← All brands in {node.name}</Link>
          </div>
        )}
      </header>

      <div className="container pb-20">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : showBrandGrid ? (
          <div>
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="font-display text-xl font-semibold">Shop by Brand</h2>
              <button
                onClick={() => setSearchParams({})}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View all products →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <button
                onClick={() => setSearchParams({})}
                className="group aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary bg-secondary/30 flex flex-col items-center justify-center text-center p-4 transition"
              >
                <span className="font-display text-2xl font-bold text-gradient">All</span>
                <span className="text-xs text-muted-foreground mt-1">{productsInSubtree.length} products</span>
              </button>
              {brands.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSearchParams({ brand: b.slug })}
                  className="group aspect-square rounded-2xl border bg-card hover:border-primary hover:shadow-lg flex flex-col items-center justify-center p-4 transition"
                >
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} className="max-h-16 max-w-full object-contain mb-2 opacity-80 group-hover:opacity-100" />
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-2">
                      <span className="font-display text-2xl font-bold">{b.name.charAt(0)}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium">{b.name}</span>
                  <span className="text-xs text-muted-foreground">{b.count} items</span>
                </button>
              ))}
            </div>
            <div className="mt-12">
              <h3 className="font-display text-lg font-semibold mb-4">All {node.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {productsInSubtree.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </div>
        ) : (
          <>
            {brands.length > 1 && (
              <div className="mb-6 flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => setSearchParams({})}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${!brandFilter ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}
                >
                  All brands
                </button>
                {brands.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSearchParams({ brand: b.slug })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${brandFilter === b.slug ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}
                  >
                    {b.name} <span className="opacity-60">({b.count})</span>
                  </button>
                ))}
              </div>
            )}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No products available in this category yet.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
