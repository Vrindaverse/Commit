'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  CheckSquare,
  Flame,
  GraduationCap,
  NotebookPen,
  Rocket,
  Settings,
  Sparkles,
  Star,
  Target,
  Trophy,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import TiltCard from './tilt-card';

type Category = 'Plan' | 'Track' | 'Grow' | 'System';

interface Feature {
  id:
    | 'goals'
    | 'tasks'
    | 'habits'
    | 'finance'
    | 'academics'
    | 'learning'
    | 'journal'
    | 'projects'
    | 'analytics'
    | 'achievements'
    | 'settings';
  icon: LucideIcon;
  title: string;
  blurb: string;
  color: string;
  shadow: string;
  category: Category;
  big?: boolean;
}

const FEATURES: Feature[] = [
  {
    id: 'goals',
    icon: Target,
    title: 'Goals',
    blurb: 'Long, medium, and short-term goals with draggable milestones that actually move.',
    color: 'var(--sticker-purple)',
    shadow: 'var(--shadow-purple)',
    category: 'Plan',
    big: true,
  },
  {
    id: 'tasks',
    icon: CheckSquare,
    title: 'Tasks',
    blurb: 'List, kanban, and calendar views. Priorities, due dates, tags.',
    color: 'var(--sticker-blue)',
    shadow: 'var(--shadow-blue)',
    category: 'Plan',
  },
  {
    id: 'projects',
    icon: Rocket,
    title: 'Projects',
    blurb: 'Break ambitious work into shippable tasks and milestones.',
    color: 'var(--sticker-yellow)',
    shadow: 'var(--shadow-yellow)',
    category: 'Plan',
  },
  {
    id: 'habits',
    icon: Flame,
    title: 'Habits',
    blurb: 'A contribution grid and streak tracking that makes consistency visible.',
    color: 'var(--sticker-peach)',
    shadow: 'var(--shadow-pink)',
    category: 'Track',
  },
  {
    id: 'finance',
    icon: Wallet,
    title: 'Finance',
    blurb: 'Expenses, income, budgets, and loans with monthly insight.',
    color: 'var(--sticker-green)',
    shadow: 'var(--shadow-green)',
    category: 'Track',
  },
  {
    id: 'academics',
    icon: GraduationCap,
    title: 'Academics',
    blurb: 'Subjects and an exam timeline so nothing slips.',
    color: 'var(--sticker-yellow)',
    shadow: 'var(--shadow-yellow)',
    category: 'Track',
  },
  {
    id: 'learning',
    icon: BookOpen,
    title: 'Learning',
    blurb: 'Personal learning paths with module checklists.',
    color: 'var(--sticker-teal)',
    shadow: 'var(--shadow-blue)',
    category: 'Grow',
  },
  {
    id: 'journal',
    icon: NotebookPen,
    title: 'Journal',
    blurb: 'Daily reflections and mood in a calm, quiet space.',
    color: 'var(--sticker-pink)',
    shadow: 'var(--shadow-pink)',
    category: 'Grow',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    title: 'Analytics',
    blurb: 'Productivity trends across every area of life.',
    color: 'var(--sticker-green)',
    shadow: 'var(--shadow-green)',
    category: 'Grow',
  },
  {
    id: 'achievements',
    icon: Trophy,
    title: 'Achievements',
    blurb: 'Tiered badges that reward real follow-through.',
    color: 'var(--sticker-peach)',
    shadow: 'var(--shadow-yellow)',
    category: 'Grow',
  },
  {
    id: 'settings',
    icon: Settings,
    title: 'Settings',
    blurb: 'Currency, export, and account controls that stay out of the way.',
    color: 'var(--sticker-purple)',
    shadow: 'var(--shadow-purple)',
    category: 'System',
  },
];

const FILTERS: Array<'All' | Category> = ['All', 'Plan', 'Track', 'Grow', 'System'];

export default function FeatureWall() {
  const [filter, setFilter] = useState<'All' | Category>('All');
  const sectionRef = useRef<HTMLElement>(null);

  const visible = filter === 'All' ? FEATURES : FEATURES.filter((f) => f.category === filter);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }

  return (
    <section
      id="features"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative scroll-mt-20 overflow-hidden px-4 py-20 sm:px-6 sm:py-28"
      style={{ '--mx': '50%', '--my': '30%' } as React.CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(360px circle at var(--mx) var(--my), oklch(88% 0.11 96 / 0.3), transparent 70%)',
        }}
      />
      <div aria-hidden className="dot-grid-ink pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] font-extrabold uppercase tracking-[0.24em] text-[var(--ink-soft)]">
              <Sparkles size={12} /> Everything, one place
            </p>
            <h2 className="font-display text-4xl font-extrabold leading-[1.0] sm:text-5xl">
              Eleven tools that actually talk to each other.
            </h2>
          </motion.div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter features">
            {FILTERS.map((f) => {
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={isActive}
                  className={`rounded-full border-[2px] border-[#2D2D2D] px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-150 ${
                    isActive
                      ? 'bg-[#2A2A2A] text-[var(--paper-2)] shadow-[3px_3px_0_0_var(--shadow-purple)]'
                      : 'bg-[var(--paper-2)] text-[var(--ink)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--shadow-yellow)]'
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          layout
          className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  layout
                  key={feature.id}
                  initial={{ opacity: 0, scale: 0.94, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -10 }}
                  transition={{ duration: 0.35, delay: i * 0.025, ease: [0.22, 1, 0.36, 1] }}
                  className={feature.big ? 'col-span-2' : ''}
                >
                  <TiltCard
                    shadow={feature.shadow}
                    className={`group flex h-full flex-col p-3.5 sm:p-6 ${
                      feature.big ? 'sm:p-7' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-xl border-[3px] border-[#2D2D2D] transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 sm:h-11 sm:w-11"
                        style={{ backgroundColor: feature.color }}
                      >
                        <Icon size={20} />
                      </span>
                      <span className="mt-1 hidden font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--ink-soft)]/65 sm:block">
                        {feature.category}
                      </span>
                    </div>
                    <h3
                      className={`mt-3 font-display font-extrabold sm:mt-4 ${
                        feature.big ? 'text-xl sm:text-2xl' : 'text-base sm:text-xl'
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 hidden text-sm font-medium leading-relaxed text-[var(--ink-soft)] sm:block">
                      {feature.blurb}
                    </p>
                    <div className="mt-3 flex-1 sm:mt-4" />
                    <FeatureArt id={feature.id} big={feature.big} color={feature.color} />
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureArt({
  id,
  big,
  color,
}: {
  id: Feature['id'];
  big?: boolean;
  color: string;
}) {
  const shell = `relative mt-3 overflow-hidden rounded-xl border-[2px] border-[#2D2D2D] bg-[var(--paper)] sm:mt-4 ${
    big ? 'h-16 sm:h-20' : 'h-12 sm:h-16'
  }`;

  switch (id) {
    case 'goals':
      return (
        <div className={shell}>
          <div className="flex h-full flex-col justify-center gap-2 px-3">
            <div className="flex items-center justify-between font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--ink-soft)]">
              <span>Half-marathon</span>
              <span>3 / 5</span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((m) => (
                <div
                  key={m}
                  className={`h-5 flex-1 rounded-[4px] border-[2px] border-[#2D2D2D] transition-all duration-300 ${
                    m <= 3 ? 'group-hover:h-6' : ''
                  }`}
                  style={{ backgroundColor: m <= 3 ? 'var(--sticker-purple)' : 'var(--paper-2)' }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    case 'tasks':
      return (
        <div className={shell}>
          <div className="flex h-full flex-col justify-center gap-1.5 px-3">
            {['Ship landing', 'Review PR', 'Read 20 pages'].map((t, i) => (
              <div key={t} className="flex items-center gap-2 text-[9px] font-bold">
                <span
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border-[2px] border-[#2D2D2D] transition-colors ${
                    i < 2
                      ? 'bg-[var(--sticker-blue)]'
                      : 'bg-[var(--paper-2)] group-hover:bg-[var(--sticker-blue)]'
                  }`}
                >
                  {(i < 2 || false) && (
                    <CheckSquare size={8} className="group-hover:opacity-100" />
                  )}
                </span>
                <span
                  className={`transition-opacity ${
                    i < 2
                      ? 'line-through opacity-40'
                      : 'opacity-70 group-hover:line-through group-hover:opacity-40'
                  }`}
                >
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    case 'habits':
      return (
        <div className={shell}>
          <div className="flex h-full items-center justify-center px-3">
            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 36 }).map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-[1px] border border-[#2D2D2D]/50 transition-all duration-300"
                  style={{
                    backgroundColor:
                      (i * 7) % 11 < 5
                        ? 'var(--sticker-peach)'
                        : (i * 5) % 7 < 2
                          ? 'var(--sticker-yellow)'
                          : 'transparent',
                    transitionDelay: `${(i % 12) * 18}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    case 'finance':
      return (
        <div className={shell}>
          <div className="flex h-full items-end gap-1 px-3 pb-2 pt-3">
            {[35, 55, 42, 70, 58, 86, 64].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-[3px] border-[1.5px] border-b-0 border-[#2D2D2D] transition-all duration-300 group-hover:opacity-90"
                style={{
                  height: `${h}%`,
                  backgroundColor:
                    i % 3 === 0
                      ? 'var(--sticker-green)'
                      : i % 3 === 1
                        ? 'var(--sticker-yellow)'
                        : 'var(--sticker-blue)',
                  transitionDelay: `${i * 30}ms`,
                }}
              />
            ))}
          </div>
        </div>
      );
    case 'academics':
      return (
        <div className={shell}>
          <div className="relative flex h-full items-center px-4">
            <div className="absolute left-4 right-4 top-1/2 h-[2px] -translate-y-1/2 bg-[#2D2D2D]/20" />
            {[
              { d: 'Mon', c: 'var(--sticker-yellow)', label: 'Phy' },
              { d: 'Thu', c: 'var(--sticker-peach)', label: 'Math' },
              { d: 'Sat', c: 'var(--sticker-pink)', label: 'Chem' },
            ].map((e, i) => (
              <div
                key={e.d}
                className="relative flex flex-1 flex-col items-center gap-1"
                style={{ marginTop: i === 1 ? -10 : 0 }}
              >
                <span
                  className="h-3 w-3 rounded-full border-[2px] border-[#2D2D2D] transition-transform duration-300 group-hover:scale-125"
                  style={{ backgroundColor: e.c }}
                />
                <span className="font-mono text-[7px] font-bold uppercase text-[var(--ink-soft)]">
                  {e.d}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    case 'learning':
      return (
        <div className={shell}>
          <div className="flex h-full items-center gap-3 px-3">
            <div
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(${color} 0 68%, var(--paper-2) 68% 100%)`,
              }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#2D2D2D] bg-[var(--paper)] font-mono text-[8px] font-extrabold">
                68
              </span>
            </div>
            <div className="space-y-1">
              {['Foundations', 'Practice', 'Ship a project'].map((m, i) => (
                <div key={m} className="flex items-center gap-1.5 text-[8px] font-bold">
                  <span
                    className={`h-2 w-2 rounded-[2px] border border-[#2D2D2D] ${
                      i < 2 ? 'bg-[var(--sticker-green)]' : 'bg-[var(--paper-2)]'
                    }`}
                  />
                  <span className={i < 2 ? 'opacity-50' : 'opacity-80'}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case 'journal':
      return (
        <div className={shell}>
          <div className="flex h-full flex-col justify-center gap-1.5 px-3">
            <div className="flex gap-1">
              {['var(--sticker-yellow)', 'var(--sticker-green)', 'var(--sticker-blue)'].map(
                (c, i) => (
                  <span
                    key={i}
                    className="h-2.5 w-2.5 rounded-full border border-[#2D2D2D]"
                    style={{ backgroundColor: c, opacity: i === 1 ? 1 : 0.25 }}
                  />
                ),
              )}
            </div>
            <div className="h-[3px] w-full rounded-full bg-[#2D2D2D]/15" />
            <div className="h-[3px] w-4/5 rounded-full bg-[#2D2D2D]/15" />
            <div className="h-[3px] w-2/3 rounded-full bg-[#2D2D2D]/15" />
          </div>
        </div>
      );
    case 'projects':
      return (
        <div className={shell}>
          <div className="grid h-full grid-cols-3 gap-1.5 p-2.5">
            {[
              ['#', '#'],
              ['#'],
              ['#', '#', '#'],
            ].map((col, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="h-1 w-3 rounded-full bg-[#2D2D2D]/30" />
                {col.map((_, j) => (
                  <span
                    key={j}
                    className="h-2.5 w-full rounded-[3px] border border-[#2D2D2D] transition-all duration-300 group-hover:translate-y-0.5"
                    style={{
                      backgroundColor:
                        i === 0
                          ? 'var(--sticker-yellow)'
                          : i === 1
                            ? 'var(--sticker-blue)'
                            : 'var(--sticker-green)',
                      opacity: 0.5 + j * 0.2,
                      transitionDelay: `${(i + j) * 30}ms`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    case 'analytics':
      return (
        <div className={shell}>
          <svg viewBox="0 0 120 48" className="h-full w-full" preserveAspectRatio="none">
            <path
              d="M4 40 L20 34 L36 36 L52 24 L68 28 L84 15 L100 18 L116 6"
              fill="none"
              stroke="#2D2D2D"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="150"
              strokeDashoffset="0"
              className="transition-all duration-700 group-hover:stroke-[4]"
            />
            <path
              d="M4 40 L20 34 L36 36 L52 24 L68 28 L84 15 L100 18 L116 6 L116 48 L4 48 Z"
              fill="var(--sticker-green)"
              opacity="0.35"
            />
            <circle cx="116" cy="6" r="4" fill="var(--sticker-yellow)" stroke="#2D2D2D" strokeWidth="2" />
          </svg>
        </div>
      );
    case 'achievements':
      return (
        <div className={shell}>
          <div className="flex h-full items-center justify-center gap-2.5 px-3">
            <span
              className="flex h-8 w-8 rotate-[-6deg] items-center justify-center rounded-lg border-[2px] border-[#2D2D2D] transition-transform duration-300 group-hover:rotate-6"
              style={{ backgroundColor: 'var(--sticker-yellow)' }}
            >
              <Star size={15} />
            </span>
            <div>
              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
                Tier II
              </p>
              <p className="text-[9px] font-extrabold leading-tight">Consistency keeper</p>
            </div>
          </div>
        </div>
      );
    case 'settings':
      return (
        <div className={shell}>
          <div className="flex h-full flex-col justify-center gap-1.5 px-3">
            {[
              { label: 'INR ₹', on: true },
              { label: 'Dark ink', on: false },
              { label: 'Weekly export', on: true },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-[8px] font-bold">
                <span className="opacity-70">{row.label}</span>
                <span
                  className={`relative h-3 w-6 rounded-full border border-[#2D2D2D] ${
                    row.on ? 'bg-[var(--sticker-purple)]' : 'bg-[var(--paper-2)]'
                  }`}
                >
                  <span
                    className={`absolute top-[1px] h-[7px] w-[7px] rounded-full bg-[#2D2D2D] transition-all ${
                      row.on ? 'left-[13px]' : 'left-[1px]'
                    }`}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}
