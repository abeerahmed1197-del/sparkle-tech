import { useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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

const findNode = (roots: CategoryNode[], slug: string): CategoryNode | null => {
  for (const r of roots) {
    if (r.slug === slug) return r;
    const found = r.children.find(c => c.slug === slug);
    if (found) return found;
  }
  return null;
};

const CategoryPage = () => {
  const { parentSlug, childSlug } = useParams<{ parentSlug: string; childSlug?: string }>();
  const { data: tree } = useCategoryTree();
  const { data: products, isLoading } = useAllProducts();

  const parent = useMemo(() => tree?.find(c => c.slug === parentSlug) || null, [tree, parentSlug]);
  const child = useMemo(() => (childSlug && parent ? parent.children.find(c => c.slug === childSlug) || null : null), [parent, childSlug]);
  const active = child || parent;

  const activeProducts = useMemo(() => {
    if (!products || !active) return [];
    const slugs = child
      ? [child.slug]
      : [parent!.slug, ...(parent!.children?.map(c => c.slug) || [])];
    return products
      .filter(p => p.is_active)
      .filter(p => p.categories && slugs.includes(p.categories.slug));
  }, [products, active, parent, child]);

  useEffect(() => {
    if (!active) return;
    const title = `${active.name}${child && parent ? ` · ${parent.name}` : ''} | eMobiles`;
    const desc = `Shop the latest ${active.name.toLowerCase()} at eMobiles. ${activeProducts.length} products with fast shipping and 30-day returns.`;
    setMeta(title.slice(0, 60), desc.slice(0, 160));
  }, [active, parent, child, activeProducts.length]);

  if (!tree) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        <Footer />
      </div>
    );
  }

  if (!parent || (childSlug && !child)) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Category Not Found</h1>
          <Link to="/shop" className="text-primary underline">Browse all products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-foreground">Home</Link><span>/</span>
          {child ? (
            <>
              <Link to={`/c/${parent.slug}`} className="hover:text-foreground">{parent.name}</Link><span>/</span>
              <span className="text-foreground">{child.name}</span>
            </>
          ) : (
            <span className="text-foreground">{parent.name}</span>
          )}
        </nav>
      </div>

      <header className="container pt-2 pb-8">
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">{active!.name}</h1>
        <p className="text-muted-foreground mt-2">{activeProducts.length} products</p>

        {!child && parent.children.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {parent.children.map(c => (
              <Link
                key={c.id}
                to={`/c/${parent.slug}/${c.slug}`}
                className="px-4 py-2 rounded-full border border-border bg-card text-sm font-medium hover:border-primary hover:text-primary transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="container pb-20">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : activeProducts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No products available in this category yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {activeProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
