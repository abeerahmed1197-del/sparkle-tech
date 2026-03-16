import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  image: string | null;
  brand_name: string | null;
  category_name: string | null;
}

const SearchCommand = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('id, name, slug, price, discount_price, brands(name), categories(name), product_images(url)')
      .eq('is_active', true)
      .ilike('name', `%${q}%`)
      .limit(8);

    if (data) {
      setResults(data.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        discount_price: p.discount_price,
        image: p.product_images?.[0]?.url || null,
        brand_name: p.brands?.name || null,
        category_name: p.categories?.name || null,
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    if (!open) { setQuery(''); setResults([]); }
  }, [open]);

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    navigate(`/product/${slug}`);
  };

  const handleViewAll = () => {
    onOpenChange(false);
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search products, brands, categories..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {!loading && query && results.length === 0 && (
          <CommandEmpty>No products found for "{query}"</CommandEmpty>
        )}
        {results.length > 0 && (
          <CommandGroup heading="Products">
            {results.map(product => (
              <CommandItem
                key={product.id}
                value={product.name}
                onSelect={() => handleSelect(product.slug)}
                className="flex items-center gap-3 py-3 cursor-pointer"
              >
                {product.image ? (
                  <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-secondary shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {product.brand_name && (
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.brand_name}</span>
                    )}
                    {product.category_name && (
                      <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{product.category_name}</Badge>
                    )}
                  </div>
                </div>
                <span className="text-sm font-bold shrink-0">
                  ${product.discount_price ?? product.price}
                </span>
              </CommandItem>
            ))}
            {query && (
              <CommandItem onSelect={handleViewAll} className="justify-center text-primary font-medium cursor-pointer">
                <Search className="h-4 w-4 mr-2" />
                View all results for "{query}"
              </CommandItem>
            )}
          </CommandGroup>
        )}
        {!query && !loading && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            <p>Start typing to search products...</p>
            <p className="text-xs mt-1">Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">⌘K</kbd> anytime to open</p>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;
