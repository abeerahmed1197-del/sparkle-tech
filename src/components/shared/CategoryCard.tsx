import { Link } from 'react-router-dom';
import { Category } from '@/types';
import { Smartphone, Watch, Headphones, Music, Cable, Tablet, Laptop, Mouse, Speaker, Battery, Camera, Car, Plug, Projector, Wifi, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Smartphone, Watch, Headphones, Music, Cable, Tablet, Laptop, Mouse, Speaker, Battery, Camera, Car, Plug, Projector, Wifi,
};

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const Icon = iconMap[category.icon] || Smartphone;

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="group flex flex-col items-center gap-3 p-4 md:p-6 rounded-2xl bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-elevation-3 hover:-translate-y-1"
    >
      <div className="p-3 md:p-4 rounded-2xl bg-background group-hover:bg-primary-foreground/20 transition-colors">
        <Icon className="h-6 w-6 md:h-8 md:w-8" />
      </div>
      <div className="text-center">
        <p className="font-display font-semibold text-sm">{category.name}</p>
        <p className="text-xs text-muted-foreground group-hover:text-primary-foreground/70 mt-0.5">{category.productCount} products</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
