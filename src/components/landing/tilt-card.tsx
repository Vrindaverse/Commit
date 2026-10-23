'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  shadow: string;
  tilt?: number;
}

export default function TiltCard({
  children,
  className = '',
  shadow,
  tilt = 8,
}: TiltCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-120, 120], [tilt, -tilt]), {
    damping: 18,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(x, [-120, 120], [-tilt, tilt]), {
    damping: 18,
    stiffness: 200,
  });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        '--neo-shadow': shadow,
        '--sh': shadow,
      } as React.CSSProperties}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`neo-card will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
