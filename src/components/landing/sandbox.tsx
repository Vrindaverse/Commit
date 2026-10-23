'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Check,
  CheckSquare,
  Flame,
  RotateCcw,
  Sparkles,
  Timer,
  Trophy,
} from 'lucide-react';

const TASKS = [
  {
    id: 'ship',
    label: 'Finish the analytics page',
    tag: 'Deep work',
    tint: 'var(--sticker-yellow)',
    startDone: true,
  },
  {
    id: 'review',
    label: 'Review pull request #42',
    tag: 'Work',
    tint: 'var(--sticker-blue)',
    startDone: false,
  },
  {
    id: 'read',
    label: 'Read 20 pages',
    tag: 'Learning',
    tint: 'var(--sticker-pink)',
    startDone: false,
  },
] as const;

const WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const RING = 2 * Math.PI * 44;
const PARTICLE_COLORS = [
  'var(--sticker-yellow)',
  'var(--sticker-pink)',
  'var(--sticker-blue)',
  'var(--sticker-green)',
  'var(--sticker-purple)',
];

type DoneMap = Record<(typeof TASKS)[number]['id'], boolean>;

const initialDone = (): DoneMap =>
  TASKS.reduce(
    (acc, task) => ({ ...acc, [task.id]: task.startDone }),
    {} as DoneMap,
  );

export default function Sandbox() {
  const reduceMotion = useReducedMotion();
  const [done, setDone] = useState<DoneMap>(initialDone);
  const [habit, setHabit] = useState(false);
  const [plus, setPlus] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const doneCount = Object.values(done).filter(Boolean).length;
  const score = Math.round((doneCount / TASKS.length) * 70 + (habit ? 30 : 0));
  const streak = 47 + (habit ? 1 : 0);
  const perfect = doneCount === TASKS.length && habit;

  useEffect(() => {
    if (!plus) return;
    const id = window.setTimeout(() => setPlus(false), 1300);
    return () => window.clearTimeout(id);
  }, [plus]);

  useEffect(() => {
    if (!perfect) return;
    const start = window.setTimeout(() => setCelebrate(true), 0);
    const end = window.setTimeout(() => setCelebrate(false), 3400);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, [perfect]);

  function toggleTask(id: keyof DoneMap) {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleHabit() {
    setHabit((prev) => {
      if (!prev) setPlus(true);
      return !prev;
    });
  }

  function reset() {
    setDone(initialDone());
    setHabit(false);
    setPlus(false);
  }

  return (
    <section
      id="sandbox"
      className="relative scroll-mt-20 overflow-hidden border-y-[3px] border-[#2D2D2D] bg-[var(--night)] px-4 py-20 text-[var(--paper-2)] sm:px-6 sm:py-28"
    >
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-[var(--sticker-yellow)] opacity-[0.13] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-32 h-[30rem] w-[30rem] rounded-full bg-[var(--sticker-blue)] opacity-[0.1] blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 flex items-center gap-2 font-mono text-[10px] font-extrabold uppercase tracking-[0.24em] text-[var(--sticker-yellow)]">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--sticker-yellow)]" />
            Live sandbox
          </p>
          <h2 className="font-display text-4xl font-extrabold leading-[0.98] sm:text-5xl">
            Don&apos;t take our
            <br />
            word for it.
            <br />
            <span className="text-[var(--sticker-yellow)]">Run a day.</span>
          </h2>
          <p className="mt-6 max-w-sm text-sm font-medium leading-relaxed text-[var(--night-soft)] sm:text-base">
            Tick the tasks. Log the habit. Watch the score and streak react in
            real time. It&apos;s the actual rhythm of Commit, minus the signup.
          </p>

          <ul className="mt-7 space-y-2.5">
            {[
              'Everything updates live',
              'No account needed to play',
              'Nothing is saved — reset anytime',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm font-semibold">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#2D2D2D] bg-[var(--sticker-green)] text-[#2A2A2A]">
                  <Check size={11} strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34, rotate: 1 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[26px] border-[3px] border-[#2D2D2D] bg-[var(--paper-2)] text-[var(--ink)] shadow-[12px_12px_0_0_var(--sticker-yellow)]">
            <div className="flex items-center justify-between border-b-[3px] border-[#2D2D2D] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full border border-[#2D2D2D] bg-[var(--sticker-pink)]" />
                <span className="h-2.5 w-2.5 rounded-full border border-[#2D2D2D] bg-[var(--sticker-yellow)]" />
                <span className="h-2.5 w-2.5 rounded-full border border-[#2D2D2D] bg-[var(--sticker-green)]" />
                <span className="ml-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                  commit / sandbox
                </span>
              </div>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#2D2D2D] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--sticker-yellow)]"
              >
                <RotateCcw size={10} /> Reset
              </button>
            </div>

            <div className="relative p-4 sm:p-5">
              <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
                <div className="relative mx-auto h-[108px] w-[108px] shrink-0">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke="#2D2D2D"
                      strokeOpacity="0.12"
                      strokeWidth="9"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke={perfect ? 'var(--sticker-green)' : 'var(--sticker-yellow)'}
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={RING}
                      animate={{ strokeDashoffset: RING * (1 - score / 100) }}
                      transition={{ type: 'spring', stiffness: 90, damping: 18 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      key={score}
                      data-testid="score"
                      initial={{ scale: 0.8, opacity: 0.6 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-display text-3xl font-extrabold leading-none"
                    >
                      {score}
                    </motion.span>
                    <span className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--ink-soft)]">
                      daily score
                    </span>
                  </div>
                </div>

                <ul className="space-y-2">
                  {TASKS.map((task) => {
                    const isDone = done[task.id];
                    return (
                      <li key={task.id}>
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          aria-pressed={isDone}
                          className={`flex w-full items-center gap-2.5 rounded-xl border-[2px] border-[#2D2D2D] px-3 py-2 text-left transition-all duration-150 hover:-translate-y-0.5 ${
                            isDone ? 'bg-[var(--paper)]' : 'bg-[var(--paper-2)]'
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-[2px] border-[#2D2D2D] transition-colors ${
                              isDone ? 'bg-[var(--sticker-green)]' : 'bg-[var(--paper-2)]'
                            }`}
                          >
                            <AnimatePresence>
                              {isDone && (
                                <motion.span
                                  initial={{ scale: 0, rotate: -20 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0 }}
                                >
                                  <CheckSquare size={11} />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block truncate text-[11.5px] font-bold transition-opacity ${
                                isDone ? 'opacity-40 line-through' : ''
                              }`}
                            >
                              {task.label}
                            </span>
                          </span>
                          <span
                            className="shrink-0 rounded-full border border-[#2D2D2D] px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.1em]"
                            style={{ backgroundColor: task.tint }}
                          >
                            {task.tag}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-4 rounded-xl border-[2px] border-[#2D2D2D] bg-[var(--paper)] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-[#2D2D2D] bg-[var(--sticker-peach)]">
                      <Flame size={12} />
                    </span>
                    <div>
                      <p className="text-[11px] font-extrabold leading-tight">Morning run</p>
                      <p className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--ink-soft)]">
                        habit · today
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleHabit}
                    aria-pressed={habit}
                    className={`relative rounded-full border-[2px] border-[#2D2D2D] px-3 py-1.5 font-mono text-[9px] font-extrabold uppercase tracking-[0.1em] transition-all ${
                      habit
                        ? 'bg-[var(--sticker-green)] shadow-[2px_2px_0_0_#2D2D2D]'
                        : 'bg-[var(--paper-2)] hover:bg-[var(--sticker-yellow)]'
                    }`}
                  >
                    {habit ? 'Logged ✓' : 'Log habit'}
                    <AnimatePresence>
                      {plus && (
                        <motion.span
                          initial={{ opacity: 1, y: 0, scale: 0.8 }}
                          animate={{ opacity: 0, y: -26, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="pointer-events-none absolute -right-1 -top-2 font-display text-sm font-extrabold text-[var(--sticker-green)]"
                        >
                          +1
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  {WEEK.map((d, i) => {
                    const isToday = i === WEEK.length - 1;
                    const on = (i < WEEK.length - 1 && i < 5) || (isToday && habit);
                    return (
                      <div key={i} className="flex flex-1 flex-col items-center gap-1">
                        <span className="font-mono text-[7px] font-bold text-[var(--ink-soft)]">
                          {d}
                        </span>
                        <span
                          className={`h-5 w-full rounded-[4px] border-[2px] border-[#2D2D2D] transition-colors ${
                            isToday ? 'ring-2 ring-[#2D2D2D] ring-offset-1' : ''
                          }`}
                          style={{
                            backgroundColor: on
                              ? isToday
                                ? 'var(--sticker-green)'
                                : 'var(--sticker-peach)'
                              : 'var(--paper-2)',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 rounded-xl border-[2px] border-[#2D2D2D] bg-[var(--sticker-blue)] px-3 py-2">
                  <Timer size={15} />
                  <div>
                    <motion.p
                      key={`streak-${streak}`}
                      data-testid="streak"
                      initial={{ y: 6, opacity: 0.5 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="font-display text-lg font-extrabold leading-none"
                    >
                      {streak}d
                    </motion.p>
                    <p className="font-mono text-[7px] font-bold uppercase tracking-[0.14em] opacity-60">
                      Streak
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border-[2px] border-[#2D2D2D] bg-[var(--sticker-purple)] px-3 py-2">
                  <Trophy size={15} />
                  <div>
                    <p className="font-display text-lg font-extrabold leading-none">
                      {doneCount}/3
                    </p>
                    <p className="font-mono text-[7px] font-bold uppercase tracking-[0.14em] opacity-60">
                      Tasks today
                    </p>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {celebrate && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                    className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-xl border-[3px] border-[#2D2D2D] bg-[var(--sticker-yellow)] px-3 py-2 shadow-[3px_3px_0_0_#2D2D2D]"
                  >
                    <Sparkles size={15} />
                    <p className="text-[11px] font-extrabold">
                      Perfect day. Every box ticked.
                    </p>
                    <span className="ml-auto font-mono text-[8px] font-bold uppercase tracking-[0.14em]">
                      100
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {celebrate && !reduceMotion && (
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2;
                    return (
                      <motion.span
                        key={i}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
                        animate={{
                          opacity: 0,
                          x: Math.cos(angle) * 110,
                          y: Math.sin(angle) * 90,
                          scale: 0.4,
                          rotate: 180,
                        }}
                        transition={{ duration: 1.1, delay: i * 0.015, ease: 'easeOut' }}
                        className="absolute left-1/2 top-1/2 h-2 w-2 rounded-[2px] border border-[#2D2D2D]"
                        style={{
                          backgroundColor: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
