'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion';
import { Activity, PenLine, TrendingUp } from 'lucide-react';
import { CaptureVisual, CompoundVisual, DailyVisual } from './loop-visuals';

const STEPS = [
  {
    n: '01',
    icon: PenLine,
    title: 'Capture everything',
    body: 'Goals, tasks, habits, expenses, exams — dump it all in. Commit files every part of life in one place so nothing lives in your head.',
    color: 'var(--sticker-blue)',
    shadow: 'var(--shadow-blue)',
    visual: CaptureVisual,
  },
  {
    n: '02',
    icon: Activity,
    title: 'Work the system daily',
    body: 'A focused dashboard surfaces exactly what matters today. Tick tasks, log habits, keep the streak alive. No overwhelm, just the next right move.',
    color: 'var(--sticker-yellow)',
    shadow: 'var(--shadow-yellow)',
    visual: DailyVisual,
  },
  {
    n: '03',
    icon: TrendingUp,
    title: 'Watch it compound',
    body: 'Analytics and achievements turn small daily wins into visible momentum. You see the progress — so you keep going.',
    color: 'var(--sticker-green)',
    shadow: 'var(--shadow-green)',
    visual: CompoundVisual,
  },
];

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function ScrollStory() {
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)));
    setActive(next);
  });

  const goToStep = (index: number) => {
    const el = ref.current;
    if (!el) return;
    const top =
      window.scrollY +
      el.getBoundingClientRect().top +
      ((index + 0.45) / STEPS.length) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  if (mounted && reduceMotion) {
    return (
      <section id="loop" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
        <p className="mb-3 font-mono text-[10px] font-extrabold uppercase tracking-[0.24em] text-[var(--ink-soft)]">
          The loop
        </p>
        <h2 className="mb-12 max-w-2xl font-display text-4xl font-extrabold leading-[1.02] sm:text-5xl">
          Three moves, compounding forever.
        </h2>
        <div className="space-y-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const Visual = step.visual;
            return (
              <div
                key={step.n}
                className="grid gap-0 overflow-hidden rounded-[28px] border-[3px] border-[#2D2D2D] bg-[var(--paper-2)] lg:grid-cols-2"
                style={{ boxShadow: `8px 8px 0 0 ${step.shadow}` }}
              >
                <div className="p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-[#2D2D2D]"
                      style={{ backgroundColor: step.color }}
                    >
                      <Icon size={22} />
                    </span>
                    <span className="font-display text-2xl font-extrabold">{step.n}</span>
                  </div>
                  <h3 className="font-display text-2xl font-extrabold">{step.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--ink-soft)]">
                    {step.body}
                  </p>
                </div>
                <div className="border-t-[3px] border-[#2D2D2D] bg-[var(--paper)] lg:border-l-[3px] lg:border-t-0">
                  <Visual />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <>
      <span id="loop" aria-hidden className="block scroll-mt-24" />

      {/* Desktop: scroll-driven loop */}
      <section ref={ref} className="relative hidden h-[290vh] lg:block">
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-1 items-center gap-12 px-6">
            <div className="w-[46%] shrink-0">
              <p className="mb-3 font-mono text-[10px] font-extrabold uppercase tracking-[0.24em] text-[var(--ink-soft)]">
                The loop
              </p>
              <h2 className="mb-8 max-w-md font-display text-5xl font-extrabold leading-[0.98]">
                Three moves,
                <br />
                compounding forever.
              </h2>

              <div className="relative pl-7">
                <div className="absolute bottom-2 left-[7px] top-2 w-[2px] bg-[#2D2D2D]/12">
                  <motion.div
                    style={{ scaleY: scrollYProgress }}
                    className="h-full w-full origin-top bg-[#2D2D2D]"
                  />
                </div>

                <div className="space-y-5">
                  {STEPS.map((step, i) => {
                    const isActive = i === active;
                    return (
                      <button
                        key={step.n}
                        type="button"
                        onClick={() => goToStep(i)}
                        className="group relative block w-full text-left"
                        aria-current={isActive ? 'step' : undefined}
                      >
                        <span
                          className={`absolute -left-7 top-1.5 h-4 w-4 rounded-full border-[3px] border-[#2D2D2D] transition-colors duration-300 ${
                            isActive ? 'scale-110' : 'bg-[var(--paper)]'
                          }`}
                          style={{
                            backgroundColor: isActive ? step.color : undefined,
                          }}
                        />
                        <p
                          className={`font-mono text-[9px] font-bold uppercase tracking-[0.22em] transition-colors duration-300 ${
                            isActive ? 'text-[var(--ink)]' : 'text-[var(--ink-soft)]/60'
                          }`}
                        >
                          Step {step.n}
                        </p>
                        <h3
                          className={`font-display text-2xl font-extrabold leading-tight transition-all duration-300 ${
                            isActive
                              ? 'text-[var(--ink)]'
                              : 'text-[var(--ink)]/35 group-hover:text-[var(--ink)]/60'
                          }`}
                        >
                          {step.title}
                        </h3>
                        <div
                          className={`grid transition-all duration-300 ${
                            isActive ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <p className="overflow-hidden text-sm font-medium leading-relaxed text-[var(--ink-soft)]">
                            {step.body}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative flex h-[540px] flex-1 items-center justify-center">
              <div
                aria-hidden
                className="pointer-events-none absolute h-72 w-72 rounded-full opacity-30 blur-3xl transition-colors duration-500"
                style={{ backgroundColor: STEPS[active].color }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 26, rotate: -2, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -18, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full max-w-[480px] overflow-hidden rounded-[28px] border-[3px] border-[#2D2D2D] bg-[var(--paper-2)]"
                  style={{ boxShadow: `10px 10px 0 0 ${STEPS[active].shadow}` }}
                >
                  <div className="flex items-center justify-between border-b-[3px] border-[#2D2D2D] px-4 py-2.5">
                    <span className="font-mono text-[9px] font-extrabold uppercase tracking-[0.22em] text-[var(--ink-soft)]">
                      Life, in motion
                    </span>
                    <span className="flex gap-1">
                      {STEPS.map((s, i) => (
                        <span
                          key={s.n}
                          className="h-2 w-2 rounded-full border border-[#2D2D2D] transition-colors"
                          style={{ backgroundColor: i === active ? s.color : 'transparent' }}
                        />
                      ))}
                    </span>
                  </div>
                  <div className="h-[420px]">
                    {(() => {
                      const Visual = STEPS[active].visual;
                      return <Visual />;
                    })()}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile: stacked loop */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 lg:hidden sm:px-6">
        <p className="mb-3 font-mono text-[10px] font-extrabold uppercase tracking-[0.24em] text-[var(--ink-soft)]">
          The loop
        </p>
        <h2 className="mb-10 max-w-2xl font-display text-4xl font-extrabold leading-[1.02]">
          Three moves, compounding forever.
        </h2>
        <div className="space-y-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const Visual = step.visual;
            return (
              <div
                key={step.n}
                className="overflow-hidden rounded-[28px] border-[3px] border-[#2D2D2D] bg-[var(--paper-2)]"
                style={{ boxShadow: `8px 8px 0 0 ${step.shadow}` }}
              >
                <div className="flex items-center gap-3 border-b-[3px] border-[#2D2D2D] p-5">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-[#2D2D2D]"
                    style={{ backgroundColor: step.color }}
                  >
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                      Step {step.n}
                    </p>
                    <h3 className="font-display text-xl font-extrabold leading-tight">{step.title}</h3>
                  </div>
                </div>
                <div className="bg-[var(--paper)]">
                  <Visual />
                </div>
                <p className="border-t-[3px] border-[#2D2D2D] p-5 text-sm font-medium leading-relaxed text-[var(--ink-soft)]">
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
