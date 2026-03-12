import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { brands } from '@/data/categories';

const Brands = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="container py-8 pb-16">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-foreground">Home</Link><span>/</span><span className="text-foreground">Brands</span>
      </div>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">Our Brands</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {brands.map(brand => (
          <Link key={brand.id} to={`/shop?brand=${brand.slug}`}
            className="p-4 md:p-6 rounded-2xl bg-secondary/50 hover:bg-primary hover:text-primary-foreground text-center font-display font-semibold text-sm transition-all hover:shadow-elevation-3 hover:-translate-y-1">
            {brand.name}
          </Link>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

export default Brands;
