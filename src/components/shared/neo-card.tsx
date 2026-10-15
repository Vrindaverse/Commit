'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  delay?: number;
  fullWidth?: boolean;
}

export default function NeoCard({ children, className, color, delay = 0, fullWidth }: NeoCardProps) {
  const reduceMotion = useReducedMotion();
  
  if (reduceMotion) {
    return (
      <div
        className={cn('neo-card p-5', fullWidth && 'w-full', className)}
        style={color ? ({ '--neo-shadow': color } as React.CSSProperties) : undefined}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(delay, 0.1), ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={cn('neo-card p-5', fullWidth && 'w-full', className)}
      style={color ? ({ '--neo-shadow': color } as React.CSSProperties) : undefined}
    >
      {children}
    </motion.div>
  );
}
