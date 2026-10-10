'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback, useSyncExternalStore } from 'react';
import {
  LayoutDashboard, Target, CheckSquare, Flame, NotebookPen,
  Rocket, BookOpen, GraduationCap, Trophy, BarChart3, Settings,
} from 'lucide-react';

const dialItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard, color: '#F7E8A4' },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare, color: '#B8D8F8' },
  { href: '/habits', label: 'Habits', icon: Flame, color: '#F8C8C8' },
  { href: '/goals', label: 'Goals', icon: Target, color: '#FFD8BE' },
  { href: '/journal', label: 'Journal', icon: NotebookPen, color: '#FFF0C0' },
  { href: '/projects', label: 'Projects', icon: Rocket, color: '#F8D8E8' },
  { href: '/learning', label: 'Learning', icon: BookOpen, color: '#C8F0E8' },
  { href: '/academics', label: 'Academics', icon: GraduationCap, color: '#D0E8F8' },
  { href: '/achievements', label: 'Achievements', icon: Trophy, color: '#F7E8A4' },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, color: '#E8D0F8' },
  { href: '/settings', label: 'Settings', icon: Settings, color: '#F0ECE4' },
];

export default function MobileNav() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const swipeX = useRef(0);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const dialRef = useRef<HTMLDivElement>(null);
  const lastAngle = useRef(0);
  const cumulativeRotation = useRef(0);
  const [rotation, setRotation] = useState(0);

  const handleSwipeDown = useCallback((e: React.PointerEvent) => {
    swipeX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handleSwipeMove = useCallback((e: React.PointerEvent) => {
    const dx = swipeX.current - e.clientX;
    if (dx > 35) setOpen(true);
  }, []);

  const getAngle = useCallback((cx: number, cy: number, px: number, py: number) => {
    return Math.atan2(py - cy, px - cx);
  }, []);

  const handleDialDown = useCallback((e: React.PointerEvent) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    lastAngle.current = getAngle(cx, cy, e.clientX, e.clientY);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [getAngle]);

  const handleDialMove = useCallback((e: React.PointerEvent) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const currentAngle = getAngle(cx, cy, e.clientX, e.clientY);
    let delta = currentAngle - lastAngle.current;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    cumulativeRotation.current += delta;
    lastAngle.current = currentAngle;
    const total = cumulativeRotation.current;
    setRotation(total);
    const n = dialItems.length;
    const idx = Math.round(((total % (Math.PI * 2)) / (Math.PI * 2)) * n + n) % n;
    setSelected(idx);
  }, [getAngle]);

  const handleDialUp = useCallback(() => {
    cumulativeRotation.current = 0;
    setRotation(0);
    if (dialItems[selected]) {
      router.push(dialItems[selected].href);
      setOpen(false);
    }
    setSelected(0);
  }, [selected, router]);

  const n = dialItems.length;
  const R = 170;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <AnimatePresence>
        {open && mounted && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 pointer-events-auto bg-black/10 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.3, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
              style={{ width: R * 2, height: R * 2 }}
            >
              <div
                ref={dialRef}
                onPointerDown={handleDialDown}
                onPointerMove={handleDialMove}
                onPointerUp={handleDialUp}
                onPointerCancel={handleDialUp}
                className="relative w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
                style={{ touchAction: 'none' }}
              >
                {/* Outer ring */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${R * 2} ${R * 2}`}>
                  <circle cx={R} cy={R} r={R - 8} fill="rgba(255,253,248,0.85)" stroke="#2D2D2D" strokeWidth="2" />
                  <motion.circle
                    cx={R} cy={R} r={R - 8}
                    fill="none" stroke="#2D2D2D" strokeWidth="1.5"
                    strokeDasharray="4 4"
                    animate={{ strokeDashoffset: [0, 60] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                  />
                </svg>

                {/* Selected item label */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                  <motion.div
                    key={selected}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-3 py-1 rounded-full border-[2px] border-[#2D2D2D] bg-[#FFFDF8] shadow-[2px_2px_0px_0px_var(--neo-shadow)]"
                  >
                    <span className="text-[9px] font-extrabold whitespace-nowrap">{dialItems[selected].label}</span>
                  </motion.div>
                </div>

                {/* Rotating track */}
                <motion.div
                  animate={{ rotate: (rotation * 180) / Math.PI }}
                  transition={{ type: 'spring', stiffness: 150, damping: 25 }}
                  className="absolute inset-0"
                  style={{ transformOrigin: 'center' }}
                >
                  {dialItems.map((item, i) => {
                    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
                    const x = (R - 22) * Math.cos(angle);
                    const y = (R - 22) * Math.sin(angle);
                    const isSelected = i === selected;
                    const Icon = item.icon;
                    const sz = isSelected ? 50 : 40;
                    return (
                      <div
                        key={item.href}
                        className="absolute flex items-center justify-center rounded-full border-[2px] border-[#2D2D2D] transition-shadow"
                        style={{
                          left: R + x - sz / 2,
                          top: R + y - sz / 2,
                          width: sz,
                          height: sz,
                          backgroundColor: isSelected ? '#F7E8A4' : item.color,
                          boxShadow: isSelected ? '0 0 0 3px #FFFDF8, 0 0 0 5px #2D2D2D' : '2px 2px 0px 0px #2D2D2D',
                          zIndex: isSelected ? 10 : 1,
                        }}
                      >
                        <Icon size={isSelected ? 20 : 14} />
                      </div>
                    );
                  })}
                </motion.div>

                {/* Center hub */}
                <div className="absolute rounded-full border-[2px] border-[#2D2D2D] bg-[#FFFDF8] shadow-[2px_2px_0px_0px_var(--neo-shadow)] flex items-center justify-center pointer-events-none"
                  style={{ left: R - 16, top: R - 16, width: 32, height: 32 }}
                >
                  <motion.span
                    key={selected}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[12px] font-extrabold"
                  >
                    {dialItems[selected].label.slice(0, 1)}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Swipe bar */}
      <div className="pointer-events-auto flex justify-center pb-5">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
        >
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="absolute -inset-3 rounded-full bg-[#CDEAC0]/20 blur-xl"
          />
          <div
            onPointerDown={handleSwipeDown}
            onPointerMove={handleSwipeMove}
            className="flex items-center justify-between gap-4 w-48 px-5 py-2.5 rounded-full border-[3px] border-[#2D2D2D] bg-[#FFFDF8] shadow-[3px_3px_0px_0px_var(--neo-shadow)] cursor-pointer select-none touch-none"
            style={{ touchAction: 'none' }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-2 h-2 rounded-full bg-[#2D2D2D]"
            />
            <span className="text-xs font-extrabold text-[#2A2A2A] tracking-widest">SECTIONS</span>
            <motion.div
              animate={{ x: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </nav>
  );
}
