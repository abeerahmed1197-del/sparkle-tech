import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface MeteorsProps {
  number?: number;
  className?: string;
}

const Meteors = ({ number = 20, className }: MeteorsProps) => {
  const meteors = useMemo(() => {
    return Array.from({ length: number }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
      size: Math.random() * 2 + 1,
    }));
  }, [number]);

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {meteors.map(m => (
        <span
          key={m.id}
          className="absolute animate-meteor rounded-full bg-primary/30"
          style={{
            top: '-5%',
            left: m.left,
            width: `${m.size}px`,
            height: `${m.size * 40}px`,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        />
      ))}
    </div>
  );
};

export default Meteors;
