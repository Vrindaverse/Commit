'use client';

import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { Check, Flame, Grip, Plus, Target, Timer, Wallet } from 'lucide-react';

type Task = { id: string; label: string; done: boolean };

const INITIAL_TASKS: Task[] = [
  { id: 'ship', label: 'Ship the new landing page', done: true },
  { id: 'pr', label: 'Review PR #42', done: true },
  { id: 'read', label: 'Read 20 pages', done: false },
];

const RING = 2 * Math.PI * 44;

function greetingFor(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HeroScene() {
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { damping: 38, stiffness: 170, mass: 0.6 });
  const sy = useSpring(my, { damping: 38, stiffness: 170, mass: 0.6 });

  const [now, setNow] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [draft, setDraft] = useState('');
  const [streak, setStreak] = useState(47);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    my.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }

  function addTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const label = draft.trim();
    if (!label) return;
    setTasks((current) => [
      ...current,
      {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
        label,
        done: false,
      },
    ]);
    setDraft('');
  }

  const doneCount = tasks.filter((task) => task.done).length;
  const progress = tasks.length ? doneCount / tasks.length : 0;
  const pct = Math.round(progress * 100);
  const allDone = tasks.length > 0 && doneCount === tasks.length;

  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);

  const glowX = useTransform(sx, [-0.5, 0.5], [12, 88]);
  const glowY = useTransform(sy, [-0.5, 0.5], [6, 94]);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${glowX}% ${glowY}%, oklch(95% 0.08 95 / 0.16), transparent 70%)`;

  const time = now
    ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : '—:—';
  const greeting = now ? greetingFor(now.getHours()) : 'Today';
  const dateLabel = now
    ? now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    : 'Your day';

  const tiles = [
    {
      icon: Flame,
      label: 'Streak',
      value: `${streak} days`,
      tint: 'var(--sticker-peach)',
      onClick: () => setStreak((s) => s + 1),
      action: 'Log today',
    },
    {
      icon: Wallet,
      label: 'Budget',
      value: '₹18.4k',
      tint: 'var(--sticker-green)',
    },
    {
      icon: Timer,
      label: 'Focus',
      value: '2h 14m',
      tint: 'var(--sticker-blue)',
    },
  ];

  return (
    <div
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative mx-auto w-full min-w-0 max-w-[560px] px-3 py-8 sm:px-8 sm:py-10"
      style={{ perspective: 1400 }}
    >
      <span
        aria-hidden
        className="outline-text pointer-events-none absolute -top-4 right-0 select-none font-display text-[11rem] font-extrabold leading-none opacity-[0.07]"
      >
        C
      </span>

      <div
        aria-hidden
        className="animate-spin-slow pointer-events-none absolute left-1/2 top-1/2 hidden h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-dashed border-[#2D2D2D]/20 sm:block"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-2 h-40 w-40 rounded-full border-[3px] border-[#2D2D2D] bg-[var(--sticker-yellow)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-3 -left-2 h-24 w-24 rotate-12 rounded-[26px] border-[3px] border-[#2D2D2D] bg-[var(--sticker-pink)]"
      />

      <motion.span
        aria-hidden
        initial={{ opacity: 0, y: -8, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.9 }}
        className="absolute left-5 top-[0.55rem] z-30 rounded-lg sm:left-8 sm:top-[1rem] border-[3px] border-[#2D2D2D] bg-[var(--sticker-green)] px-2.5 py-1 font-mono text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#2A2A2A] shadow-[3px_3px_0_0_#2D2D2D]"
      >
        Live demo · try it
      </motion.span>

      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1400 }}
        className="relative z-10 min-w-0 will-change-transform"
      >
        <div className="relative overflow-hidden rounded-[30px] border-[3px] border-[#2D2D2D] bg-[var(--ink)] shadow-[14px_14px_0_0_var(--shadow-purple)]">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 mix-blend-screen"
            style={{ background: spotlight }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />

          {/* window chrome */}
          <div className="relative z-10 flex min-w-0 items-center gap-2 border-b border-white/10 px-4 py-3 sm:px-5">
            <span className="h-2.5 w-2.5 rounded-full border border-black/40 bg-[var(--sticker-pink)]" />
            <span className="h-2.5 w-2.5 rounded-full border border-black/40 bg-[var(--sticker-yellow)]" />
            <span className="h-2.5 w-2.5 rounded-full border border-black/40 bg-[var(--sticker-green)]" />
            <span className="ml-2 truncate font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/65 sm:ml-3">
              commit / today
            </span>
            <span className="ml-auto flex items-center gap-2 font-mono text-[11px] font-bold text-white/75">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--sticker-green)]" />
              {time}
            </span>
          </div>

          <div className="relative z-10 px-5 pb-5 pt-5 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                  {dateLabel}
                </p>
                <h3 className="mt-1 font-display text-xl font-extrabold leading-tight text-[var(--paper-2)] sm:text-2xl">
                  {greeting}, Nikhil.
                </h3>
              </div>
              <motion.span
                key={streak}
                initial={{ scale: 0.8, rotate: 0 }}
                animate={{ scale: 1, rotate: 3 }}
                transition={{ type: 'spring', stiffness: 320, damping: 15 }}
                className="rounded-lg border-2 border-[#2D2D2D] bg-[var(--sticker-yellow)] px-2 py-1 font-mono text-[9px] font-extrabold uppercase tracking-wider text-[#2A2A2A] shadow-[3px_3px_0_0_#2D2D2D]"
              >
                Day {streak}
              </motion.span>
            </div>

            <div className="mt-6 flex min-w-0 flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div className="relative shrink-0">
                <svg viewBox="0 0 100 100" className="h-[104px] w-[104px] -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="9"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke={allDone ? 'var(--sticker-green)' : 'var(--sticker-yellow)'}
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={RING}
                    initial={{ strokeDashoffset: RING }}
                    animate={{ strokeDashoffset: RING * (1 - progress) }}
                    transition={{ type: 'spring', stiffness: 55, damping: 16 }}
                  />
                </svg>
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <motion.span
                    key={pct}
                    aria-hidden
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-display text-2xl font-extrabold leading-none text-[var(--paper-2)]"
                  >
                    {pct}%
                  </motion.span>
                  <span
                    aria-hidden
                    className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/55"
                  >
                    {allDone ? 'locked in' : 'done today'}
                  </span>
                  <span className="sr-only">
                    {pct} percent of today&apos;s tasks complete
                  </span>
                </div>
              </div>

              <ul className="w-full min-w-0 flex-1 space-y-0.5 sm:space-y-1.5">
                <AnimatePresence initial={false}>
                  {tasks.map((task, i) => (
                    <motion.li
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: Math.min(i * 0.06, 0.24), duration: 0.35 }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        aria-pressed={task.done}
                        aria-label={`${task.done ? 'Mark undone' : 'Complete'}: ${task.label}`}
                        className="group/task flex min-h-[44px] w-full min-w-0 items-center gap-2.5 rounded-lg py-1 text-left sm:min-h-0 sm:py-0.5"
                      >
                        <motion.span
                          whileTap={{ scale: 0.82 }}
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-[#2D2D2D] transition-colors duration-150 ${
                            task.done
                              ? 'bg-[var(--sticker-green)]'
                              : 'bg-white/10 group-hover/task:bg-white/20'
                          }`}
                        >
                          <AnimatePresence>
                            {task.done && (
                              <motion.span
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                              >
                                <Check size={11} strokeWidth={3.5} className="text-[#2A2A2A]" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.span>
                        <span
                          className={`truncate text-[11.5px] font-bold transition-colors duration-200 ${
                            task.done ? 'text-white/60 line-through' : 'text-white/90'
                          }`}
                        >
                          {task.label}
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            <form onSubmit={addTask} className="mt-4">
              <div className="flex items-center gap-2 rounded-xl border-2 border-white/[0.12] bg-white/[0.055] px-2.5 py-1.5 transition-colors duration-200 focus-within:border-[var(--sticker-yellow)] focus-within:bg-white/[0.075] sm:py-1.5">
                <Plus size={12} className="shrink-0 text-white/45" aria-hidden />
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Add a task…"
                  aria-label="Add a task to the live demo"
                  maxLength={48}
                  className="min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-white/90 placeholder:text-white/35 focus:outline-none sm:text-[11px]"
                />
                <button
                  type="submit"
                  className="flex h-8 shrink-0 items-center justify-center rounded-md border-2 border-[#2D2D2D] bg-[var(--sticker-yellow)] px-2 font-mono text-[9px] font-extrabold uppercase tracking-wider text-[#2A2A2A] transition-transform duration-150 active:scale-95 sm:h-6"
                >
                  Add
                </button>
              </div>
            </form>

            <div className="mt-4 grid min-w-0 grid-cols-3 gap-2">
              {tiles.map((tile) => {
                const Icon = tile.icon;
                const inner = (
                  <>
                    <span
                      className="mb-1.5 flex h-6 w-6 items-center justify-center rounded-md border-2 border-[#2D2D2D]"
                      style={{ backgroundColor: tile.tint }}
                    >
                      <Icon size={12} className="text-[#2A2A2A]" />
                    </span>
                    <p className="font-display text-sm font-extrabold leading-none text-[var(--paper-2)]">
                      {tile.value}
                    </p>
                    <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-white/55">
                      {tile.label}
                    </p>
                    {tile.onClick && (
                      <span className="absolute right-2 top-2 font-mono text-[8px] font-extrabold text-[var(--sticker-green)] opacity-0 transition-opacity duration-150 group-hover/tile:opacity-100">
                        +1
                      </span>
                    )}
                  </>
                );

                return tile.onClick ? (
                  <motion.button
                    key={tile.label}
                    type="button"
                    onClick={tile.onClick}
                    aria-label={`${tile.action} — streak is ${streak} days`}
                    whileTap={{ scale: 0.96 }}
                    className="group/tile relative rounded-xl border border-white/10 bg-white/[0.055] px-2.5 py-2 text-left transition-colors duration-150 hover:border-white/20 hover:bg-white/[0.09]"
                  >
                    {inner}
                  </motion.button>
                ) : (
                  <div
                    key={tile.label}
                    className="relative rounded-xl border border-white/10 bg-white/[0.055] px-2.5 py-2"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-center font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/55">
              Tick a task · add your own
              <span className="hidden sm:inline"> · drag a sticker</span>
            </p>
          </div>
        </div>
      </motion.div>

      <Satellite
        sx={sx}
        sy={sy}
        depth={22}
        rotate={-8}
        className="-left-1 top-14 sm:-left-7"
        color="var(--sticker-yellow)"
        shadow="var(--shadow-yellow)"
      >
        <p className="font-mono text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#2A2A2A]/55">
          Habits
        </p>
        <div className="mt-1.5 flex gap-1">
          {[1, 1, 1, 1, 1, 0, 0].map((on, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-[2px] border border-[#2D2D2D] ${
                on ? 'bg-[var(--sticker-green)]' : 'bg-[var(--paper-2)]'
              }`}
            />
          ))}
        </div>
      </Satellite>

      <Satellite
        sx={sx}
        sy={sy}
        depth={-32}
        rotate={7}
        className="-right-1 top-1/2 sm:-right-8"
        color="var(--sticker-blue)"
        shadow="var(--shadow-blue)"
      >
        <p className="font-mono text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#2A2A2A]/55">
          Goal
        </p>
        <p className="mt-0.5 text-[11px] font-extrabold leading-tight">Run a half-marathon</p>
        <div className="mt-1.5 flex gap-1">
          {[1, 2, 3, 4, 5].map((m) => (
            <span
              key={m}
              className={`h-1.5 flex-1 rounded-full border border-[#2D2D2D] ${
                m <= 3 ? 'bg-[var(--sticker-purple)]' : 'bg-[var(--paper-2)]'
              }`}
            />
          ))}
        </div>
      </Satellite>

      <Satellite
        sx={sx}
        sy={sy}
        depth={26}
        rotate={-5}
        className="bottom-2 left-8 sm:bottom-0 sm:left-14"
        color="var(--sticker-green)"
        shadow="var(--shadow-green)"
      >
        <div className="flex items-center gap-2">
          <Target size={13} />
          <p className="text-[11px] font-extrabold">Next exam in 12 days</p>
        </div>
      </Satellite>
    </div>
  );
}

function Satellite({
  children,
  className,
  color,
  shadow,
  rotate,
  depth,
  sx,
  sy,
}: {
  children: React.ReactNode;
  className: string;
  color: string;
  shadow: string;
  rotate: number;
  depth: number;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  const x = useTransform(sx, [-0.5, 0.5], [depth, -depth]);
  const y = useTransform(sy, [-0.5, 0.5], [depth * 0.55, -depth * 0.55]);

  return (
    <motion.div style={{ x, y }} className={`absolute z-20 hidden sm:block ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: rotate - 10 }}
        animate={{ opacity: 1, scale: 1, rotate }}
        transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.7 }}
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            drag
            dragConstraints={{ left: -52, right: 52, top: -38, bottom: 38 }}
            dragElastic={0.22}
            dragMomentum={!reduceMotion}
            whileHover={{ scale: 1.035 }}
            whileDrag={{ scale: 1.09, rotate: rotate + 3, zIndex: 40 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            data-cursor="drag"
            className="relative cursor-grab touch-none select-none rounded-2xl border-[3px] border-[#2D2D2D] bg-[var(--paper-2)] px-3 py-2 active:cursor-grabbing hard-shadow-sm"
            style={{ '--sh': shadow, backgroundColor: color } as React.CSSProperties}
          >
            <Grip
              size={9}
              aria-hidden
              className="absolute right-1.5 top-1.5 text-[#2A2A2A]/35"
            />
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
