import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, List, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import ProductCard from '@/components/shared/ProductCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { products } from '@/data/products';
import { categories, brands } from '@/data/categories';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand') ? [searchParams.get('brand')!] : []
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (selectedCategories.length > 0) {
      const catIds = categories.filter(c => selectedCategories.includes(c.slug)).map(c => c.id);
      result = result.filter(p => catIds.includes(p.categoryId));
    }

    if (selectedBrands.length > 0) {
      const brandIds = brands.filter(b => selectedBrands.includes(b.slug)).map(b => b.id);
      result = result.filter(p => brandIds.includes(p.brandId));
    }

    const effectivePrice = (p: typeof products[0]) => p.discountPrice ?? p.price;
    result = result.filter(p => {
      const price = effectivePrice(p);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sort) {
      case 'price-asc': result.sort((a, b) => effectivePrice(a) - effectivePrice(b)); break;
      case 'price-desc': result.sort((a, b) => effectivePrice(b) - effectivePrice(a)); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'best-selling': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
    }

    return result;
  }, [search, sort, selectedCategories, selectedBrands, priceRange]);

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
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={selectedCategories.includes(cat.slug)} onCheckedChange={() => toggleCategory(cat.slug)} />
              {cat.name}
            </label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="font-display font-semibold mb-3">Brands</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map(brand => (
            <label key={brand.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={selectedBrands.includes(brand.slug)} onCheckedChange={() => toggleBrand(brand.slug)} />
              {brand.name}
            </label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="font-display font-semibold mb-3">Price Range</h4>
        <Slider min={0} max={1500} step={10} value={priceRange} onValueChange={setPriceRange} className="mb-2" />
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

      {/* Breadcrumb */}
      <div className="container py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Shop</span>
        </div>
      </div>

      <div className="container pb-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold">Shop</h1>
          <div className="flex items-center gap-3">
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-40 md:w-64 h-9" />
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-40 h-9">
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
                <Button variant="outline" size="icon" className="lg:hidden h-9 w-9">
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

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterContent />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-4">{filteredProducts.length} products found</p>
            {filteredProducts.length > 0 ? (
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
