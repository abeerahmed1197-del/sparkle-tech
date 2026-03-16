import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/shared/ProductCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useProducts, useCategories, useBrands } from '@/hooks/useProducts';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand') ? [searchParams.get('brand')!] : []
  );

  const { data: allProducts, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    let result = [...allProducts];

    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => p.categories && selectedCategories.includes(p.categories.slug));
    }

    if (selectedBrands.length > 0) {
      result = result.filter(p => p.brands && selectedBrands.includes(p.brands.slug));
    }

    const effectivePrice = (p: typeof result[0]) => p.discount_price ?? p.price;
    result = result.filter(p => {
      const price = effectivePrice(p);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sort) {
      case 'price-asc': result.sort((a, b) => effectivePrice(a) - effectivePrice(b)); break;
      case 'price-desc': result.sort((a, b) => effectivePrice(b) - effectivePrice(a)); break;
      case 'newest': result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case 'best-selling': result.sort((a, b) => b.review_count - a.review_count); break;
    }

    return result;
  }, [allProducts, search, sort, selectedCategories, selectedBrands, priceRange]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  const toggleBrand = (slug: string) => {
    setSelectedBrands(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-display font-semibold mb-3">Categories</h4>
        <div className="space-y-2.5 max-h-48 overflow-y-auto">
          {categories?.map(cat => (
            <label key={cat.id} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <Checkbox checked={selectedCategories.includes(cat.slug)} onCheckedChange={() => toggleCategory(cat.slug)} />
              {cat.name}
            </label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="font-display font-semibold mb-3">Brands</h4>
        <div className="space-y-2.5 max-h-48 overflow-y-auto">
          {brands?.map(brand => (
            <label key={brand.id} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <Checkbox checked={selectedBrands.includes(brand.slug)} onCheckedChange={() => toggleBrand(brand.slug)} />
              {brand.name}
            </label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="font-display font-semibold mb-3">Price Range</h4>
        <Slider min={0} max={1500} step={10} value={priceRange} onValueChange={setPriceRange} className="mb-3" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={() => { setSelectedCategories([]); setSelectedBrands([]); setPriceRange([0, 1500]); }}>
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Shop</span>
        </div>
      </div>

      <div className="container pb-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Shop</h1>
          <div className="flex items-center gap-3">
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-40 md:w-64 h-10" />
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-44 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="best-selling">Best Selling</SelectItem>
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden h-10 w-10">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-6"><FilterContent /></div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-10">
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterContent />
          </aside>

          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">{filteredProducts.length} products found</p>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => { setSearch(''); setSelectedCategories([]); setSelectedBrands([]); setPriceRange([0, 1500]); }}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
