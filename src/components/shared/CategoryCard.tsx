import { Link } from 'react-router-dom';
import { Smartphone, Watch, Headphones, Music, Cable, Tablet, Laptop, Mouse, Speaker, Battery, Camera, Car, Plug, Projector, Wifi, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Smartphone, Watch, Headphones, Music, Cable, Tablet, Laptop, Mouse, Speaker, Battery, Camera, Car, Plug, Projector, Wifi,
};

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    image: string | null;
    product_count: number | null;
  };
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const Icon = iconMap[category.icon || ''] || Smartphone;

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="group flex flex-col items-center gap-3 p-5 md:p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1"
    >
      <div className="p-3 md:p-4 rounded-2xl bg-primary/5 group-hover:bg-primary/10 group-hover:glow transition-all duration-500">
        <Icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
      </div>
      <div className="text-center">
        <p className="font-display font-semibold text-sm">{category.name}</p>
        {category.product_count !== null && (
          <p className="text-xs text-muted-foreground mt-0.5">{category.product_count} products</p>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
