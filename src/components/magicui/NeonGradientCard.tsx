import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NeonGradientCardProps {
  children: React.ReactNode;
  className?: string;
  neonColors?: { first: string; second: string };
}

const NeonGradientCard = ({
  children,
  className,
  neonColors = { first: 'hsl(var(--primary))', second: 'hsl(var(--accent))' },
}: NeonGradientCardProps) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className={cn('relative overflow-hidden rounded-2xl p-[2px] group', className)}
  >
    <div
      className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
      style={{
        background: `linear-gradient(135deg, ${neonColors.first}, ${neonColors.second})`,
      }}
    />
    <div
      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl"
      style={{
        background: `linear-gradient(135deg, ${neonColors.first}, ${neonColors.second})`,
      }}
    />
    <div className="relative rounded-[14px] bg-card overflow-hidden">{children}</div>
  </motion.div>
);

export default NeonGradientCard;
