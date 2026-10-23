'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
} from 'framer-motion';

interface TapeProps {
  items: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
  separator?: string;
}

/**
 * A marquee that listens to the scroll. It drifts at its base speed while the
 * page is still, then accelerates as you scroll — and always pauses on hover so
 * the words stay readable when you actually want to read them.
 */
export default function Tape({
  items,
  speed = 30,
  reverse = false,
  className = '',
  separator = '✦',
}: TapeProps) {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 320 });

  const x = useMotionValue(0);
  const rowRef = useRef<HTMLSpanElement>(null);
  const rowWidth = useRef(0);
  const baseSpeed = useRef(60);

  useEffect(() => {
    const measure = () => {
      if (!rowRef.current) return;
      rowWidth.current = rowRef.current.offsetWidth;
      baseSpeed.current = Math.max(18, rowWidth.current / Math.max(8, speed));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (rowRef.current) observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, [items, speed]);

  useAnimationFrame((_, delta) => {
    if (paused || reduceMotion || rowWidth.current === 0) return;

    const boost = 1 + Math.min(Math.abs(smoothVelocity.get()) / 420, 3.2);
    const direction = reverse ? -1 : 1;
    let next = x.get() + direction * baseSpeed.current * boost * (delta / 1000);

    const width = rowWidth.current;
    if (next <= -width) next += width;
    if (next >= 0) next -= width;
    x.set(next);
  });

  const content = items.map((text, i) => (
    <span key={`${text}-${i}`} className="inline-flex items-center">
      <span className="px-5">{text}</span>
      <span aria-hidden className="px-1 opacity-50">
        {separator}
      </span>
    </span>
  ));

  return (
    <div
      className={`tape fade-x overflow-hidden whitespace-nowrap ${className}`}
      role="presentation"
      aria-hidden
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div style={{ x }} className="inline-flex w-max will-change-transform">
        <span ref={rowRef} className="inline-flex shrink-0 items-center">
          {content}
        </span>
        <span aria-hidden className="inline-flex shrink-0 items-center">
          {content}
        </span>
      </motion.div>
    </div>
  );
}
