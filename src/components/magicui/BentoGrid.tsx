import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid = ({ children, className }: BentoGridProps) => (
  <div className={cn('grid auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4', className)}>
    {children}
  </div>
);

interface BentoCardProps {
  name: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  background?: React.ReactNode;
  href?: string;
  cta?: string;
  onClick?: () => void;
}

export const BentoCard = ({ name, description, icon, className, background, onClick }: BentoCardProps) => (
  <motion.div
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
    className={cn(
      'group relative col-span-1 flex flex-col justify-end overflow-hidden rounded-2xl border border-border/50 bg-card cursor-pointer',
      className
    )}
  >
    {background && <div className="absolute inset-0">{background}</div>}
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
    <div className="relative z-10 flex flex-col gap-1.5 p-6 transition-all duration-300 group-hover:translate-y-[-4px]">
      {icon && <div className="mb-1 text-primary-foreground/80">{icon}</div>}
      <h3 className="font-display text-lg font-bold text-primary-foreground">{name}</h3>
      <p className="text-sm text-primary-foreground/60 line-clamp-2">{description}</p>
    </div>
  </motion.div>
);
