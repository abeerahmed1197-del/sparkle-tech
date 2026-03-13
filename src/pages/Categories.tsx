import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryCard from '@/components/shared/CategoryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/useProducts';

const Categories = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-10 pb-20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span><span className="text-foreground">Categories</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-10">All Categories</h1>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories?.map(cat => <CategoryCard key={cat.id} category={cat} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Categories;
