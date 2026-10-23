'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useReducedMotion, useSpring, useTransform, motion } from 'framer-motion';

interface CountUpProps {
  to: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function CountUp({
  to,
  suffix = '',
  prefix = '',
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();

  const raw = useMotionValue(0);
  const spring = useSpring(raw, { damping: 30, stiffness: 90, mass: 1 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (reduceMotion) {
      raw.jump(to);
      spring.jump(to);
      return;
    }
    if (!inView) return;
    raw.set(to);
  }, [inView, reduceMotion, raw, spring, to]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
