import { Component, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Scale, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/context/CompareContext';
import { useCompareProducts } from '@/hooks/useProducts';
import { MAX_COMPARE } from '@/lib/compare';

// The bar is mounted on every storefront route: isolate any failure in it so a
// bug here can never blank the whole app.
class CompareBarBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

const CompareBar = () => {
  const { ids, removeCompare, clearCompare } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: products } = useCompareProducts(ids);

  const hidden =
    ids.length === 0 ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/compare';
  if (hidden) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-3xl flex items-center gap-3 rounded-2xl border bg-card/90 backdrop-blur-xl shadow-elevation-2 px-4 py-3">
        <Scale className="h-5 w-5 text-primary shrink-0 hidden sm:block" />
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-sm font-medium shrink-0 hidden md:block">
            {ids.length} of {MAX_COMPARE}
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(products || []).map(p => (
              <div key={p.id} className="relative shrink-0">
                <Link to={`/product/${p.slug}`} title={p.name}>
                  <img
                    src={p.product_images?.[0]?.url || '/placeholder.svg'}
                    alt={p.name}
                    className="h-11 w-11 rounded-lg object-cover border"
                  />
                </Link>
                <button
                  onClick={() => removeCompare(p.id)}
                  aria-label={`Remove ${p.name} from compare`}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCompare} className="shrink-0 text-muted-foreground">
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline ml-1.5">Clear</span>
        </Button>
        <Button
          size="sm"
          className="shrink-0"
          disabled={ids.length < 2}
          onClick={() => navigate('/compare')}
        >
          Compare{ids.length < 2 ? ' (select 2+)' : ''}
        </Button>
      </div>
    </div>
  );
};

export default CompareBar;
