import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { useBrands } from '@/hooks/useProducts';

const Brands = () => {
  const { data: brands, isLoading } = useBrands();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-10 pb-20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span><span className="text-foreground">Brands</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-10">Our Brands</h1>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {brands?.map(brand => (
              <Link key={brand.id} to={`/shop?brand=${brand.slug}`}
                className="p-5 md:p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-card-hover text-center font-display font-semibold text-sm transition-all duration-300 hover:-translate-y-1">
                {brand.name}
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Brands;
