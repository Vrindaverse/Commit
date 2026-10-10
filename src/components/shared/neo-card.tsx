'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  delay?: number;
  fullWidth?: boolean;
}

export default function NeoCard({ children, className, color, delay = 0, fullWidth }: NeoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] } }}
      className={cn(
        'neo-card p-5',
        fullWidth && 'w-full',
        className
      )}
      style={color ? ({ '--neo-shadow': color } as React.CSSProperties) : undefined}
    >
      {children}
    </motion.div>
  );
}
