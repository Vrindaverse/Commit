'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

interface MagneticCTAProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticCTA({
  href,
  children,
  className = '',
  strength = 0.35,
}: MagneticCTAProps) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 15, stiffness: 250 });
  const springY = useSpring(y, { damping: 15, stiffness: 250 });

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-flex">
      <Link
        href={href}
        onMouseMove={reduceMotion ? undefined : handleMove}
        onMouseLeave={reduceMotion ? undefined : handleLeave}
        className={className}
      >
        {children}
      </Link>
    </motion.div>
  );
}
