import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryCard from '@/components/shared/CategoryCard';
import { categories } from '@/data/categories';

const Categories = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="container py-8 pb-16">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-foreground">Home</Link><span>/</span><span className="text-foreground">Categories</span>
      </div>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">All Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
      </div>
    </div>
    <Footer />
  </div>
);

export default Categories;
