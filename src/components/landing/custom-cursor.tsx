'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [label, setLabel] = useState('go');

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const size = useMotionValue(24);
  const bg = useMotionValue('var(--ink)');
  const rot = useMotionValue(0);
  const labelOpacity = useMotionValue(0);

  const springX = useSpring(x, { damping: 28, stiffness: 500, mass: 0.4 });
  const springY = useSpring(y, { damping: 28, stiffness: 500, mass: 0.4 });
  const auraX = useSpring(x, { damping: 40, stiffness: 90, mass: 1.2 });
  const auraY = useSpring(y, { damping: 40, stiffness: 90, mass: 1.2 });
  const springSize = useSpring(size, { stiffness: 400, damping: 28 });
  const springRot = useSpring(rot, { stiffness: 400, damping: 28 });
  const springLabel = useSpring(labelOpacity, { stiffness: 400, damping: 30 });

  useEffect(() => {
    if (reduceMotion) return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const noTouch = !window.matchMedia('(hover: none)').matches;
    if (!finePointer || !noTouch) return;

    document.documentElement.classList.add('has-custom-cursor');

    const apply = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      const typed = el?.closest('input, textarea, select');
      const interactive = el?.closest('a, button, [role="button"], [data-cursor]');
      if (interactive) {
        size.set(54);
        bg.set('var(--sticker-yellow)');
        rot.set(12);
        labelOpacity.set(1);
        setLabel(interactive.getAttribute('data-cursor') || 'go');
      } else if (typed) {
        size.set(12);
        bg.set('var(--ink)');
        rot.set(0);
        labelOpacity.set(0);
      } else {
        size.set(24);
        bg.set('var(--ink)');
        rot.set(0);
        labelOpacity.set(0);
      }
    };

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      apply(e.target);
    };
    const down = () => size.set(14);
    const up = (e: MouseEvent) => apply(e.target);

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [reduceMotion, x, y, size, bg, rot, labelOpacity]);

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: auraX, y: auraY }}
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[998] hidden lg:block"
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-2xl"
          style={{
            width: 280,
            height: 280,
            background:
              'radial-gradient(circle, var(--sticker-yellow) 0%, transparent 68%)',
            mixBlendMode: 'multiply',
          }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        style={{ x: springX, y: springY }}
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[999] hidden lg:block"
      >
        <motion.div
          style={{
            width: springSize,
            height: springSize,
            backgroundColor: bg,
            rotate: springRot,
          }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#2D2D2D]"
        >
          <motion.span
            style={{ opacity: springLabel }}
            className="flex h-full w-full items-center justify-center font-display text-[10px] font-extrabold uppercase text-[#2A2A2A]"
          >
            {label}
          </motion.span>
        </motion.div>
      </motion.div>
    </>
  );
}
