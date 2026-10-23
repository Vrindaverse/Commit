'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CheckSquare,
  Flame,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Trophy,
  Wallet,
} from 'lucide-react';

const PHRASES = [
  'Pay the electricity bill tomorrow',
  'Revise chapter 4 before Friday',
  'Book a dentist appointment',
  'Read 20 pages tonight',
];

const DAILY_TASKS = ['Ship landing page', 'Log morning run', 'Review PR #42'];

export function CaptureVisual() {
  const reduceMotion = useReducedMotion();
  const [text, setText] = useState(reduceMotion ? PHRASES[0] : '');

  useEffect(() => {
    if (reduceMotion) {
      const id = window.setTimeout(() => setText(PHRASES[0]), 0);
      return () => window.clearTimeout(id);
    }
    let cancelled = false;
    let phrase = 0;
    let char = 0;
    let deleting = false;
    let timer: number;

    const step = () => {
      if (cancelled) return;
      const target = PHRASES[phrase];
      if (!deleting) {
        char += 1;
        setText(target.slice(0, char));
        if (char >= target.length) {
          deleting = true;
          timer = window.setTimeout(step, 1700);
          return;
        }
        timer = window.setTimeout(step, 55);
      } else {
        char -= 1;
        setText(target.slice(0, char));
        if (char <= 0) {
          deleting = false;
          phrase = (phrase + 1) % PHRASES.length;
        }
        timer = window.setTimeout(step, 26);
      }
    };

    timer = window.setTimeout(step, 500);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [reduceMotion]);

  return (
    <div className="flex h-full flex-col justify-center gap-4 p-6 sm:p-8">
      <div className="rounded-2xl border-[3px] border-[#2D2D2D] bg-[var(--paper)] px-4 py-3 hard-shadow-sm" style={{ '--sh': 'var(--shadow-blue)' } as React.CSSProperties}>
        <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
          Quick capture
        </p>
        <div className="flex min-h-6 items-center gap-1 text-sm font-bold">
          <span className="text-[var(--ink-soft)]">&gt;</span>
          <span className="truncate">{text}</span>
          <span aria-hidden className="pulse-dot ml-0.5 inline-block h-4 w-[2px] bg-[var(--ink)]" />
        </div>
      </div>

      <div className="space-y-2">
        {[
          { icon: Wallet, label: 'Expense', value: '₹340 · Electricity', tint: 'var(--sticker-green)' },
          { icon: GraduationCap, label: 'Exam', value: 'Physics · Friday', tint: 'var(--sticker-yellow)' },
          { icon: CheckSquare, label: 'Task', value: 'Read 20 pages', tint: 'var(--sticker-blue)' },
        ].map((row, i) => {
          const Icon = row.icon;
          return (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 rounded-xl border-[2px] border-[#2D2D2D] bg-[var(--paper-2)] px-3 py-2"
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-[#2D2D2D]"
                style={{ backgroundColor: row.tint }}
              >
                <Icon size={13} />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--ink-soft)]">
                  {row.label}
                </p>
                <p className="truncate text-[11px] font-extrabold">{row.value}</p>
              </div>
              <span className="ml-auto font-mono text-[9px] font-bold text-[var(--ink-soft)]">
                filed ✓
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function DailyVisual() {
  const reduceMotion = useReducedMotion();
  const [tick, setTick] = useState(reduceMotion ? 3 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % 5), 2300);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const done = Math.min(tick, 3);
  const streak = 47 + (tick >= 3 ? 1 : 0);
  const pct = 34 + done * 22;

  return (
    <div className="flex h-full flex-col justify-center gap-4 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
            Today · in progress
          </p>
          <p className="font-display text-xl font-extrabold">The next right move</p>
        </div>
        <span className="flex items-center gap-1 rounded-full border-2 border-[#2D2D2D] bg-[var(--sticker-peach)] px-2.5 py-1 text-[11px] font-extrabold">
          <Flame size={12} /> {streak}
        </span>
      </div>

      <div className="rounded-2xl border-[3px] border-[#2D2D2D] bg-[var(--paper)] p-4 hard-shadow-sm" style={{ '--sh': 'var(--shadow-yellow)' } as React.CSSProperties}>
        <ul className="space-y-2.5">
          {DAILY_TASKS.map((task, i) => {
            const isDone = i < done;
            return (
              <li key={task} className="flex items-center gap-2.5">
                <motion.span
                  animate={{ scale: isDone ? 1 : 0.92 }}
                  className={`flex h-5 w-5 items-center justify-center rounded border-2 border-[#2D2D2D] transition-colors ${
                    isDone ? 'bg-[var(--sticker-green)]' : 'bg-[var(--paper-2)]'
                  }`}
                >
                  {isDone && <CheckSquare size={11} />}
                </motion.span>
                <span className={`text-[11px] font-bold ${isDone ? 'line-through opacity-45' : ''}`}>
                  {task}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 h-2 overflow-hidden rounded-full border-2 border-[#2D2D2D] bg-[var(--paper)]">
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="h-full bg-[var(--sticker-yellow)]"
          />
        </div>
        <p className="mt-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
          {pct}% of today handled
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[var(--sticker-blue)] px-3 py-2">
          <p className="font-display text-lg font-extrabold leading-none">2h 14m</p>
          <p className="mt-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.16em] opacity-60">
            Deep focus
          </p>
        </div>
        <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[var(--sticker-green)] px-3 py-2">
          <p className="font-display text-lg font-extrabold leading-none">5 / 7</p>
          <p className="mt-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.16em] opacity-60">
            Habits this week
          </p>
        </div>
      </div>
    </div>
  );
}

const BARS = [28, 42, 36, 58, 66, 78, 94];

export function CompoundVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-6 sm:p-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
            Momentum · last 7 weeks
          </p>
          <p className="font-display text-xl font-extrabold">Small wins, stacked</p>
        </div>
        <span className="flex -rotate-3 items-center gap-1 rounded-lg border-2 border-[#2D2D2D] bg-[var(--sticker-green)] px-2 py-1 text-[10px] font-extrabold shadow-[3px_3px_0_0_#2D2D2D]">
          <TrendingUp size={12} /> +42%
        </span>
      </div>

      <div className="flex h-36 items-end gap-2 rounded-2xl border-[3px] border-[#2D2D2D] bg-[var(--paper)] px-4 pb-4 pt-6">
        {BARS.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex-1 rounded-t-md border-[2px] border-b-0 border-[#2D2D2D]"
            style={{
              backgroundColor:
                i % 3 === 0
                  ? 'var(--sticker-yellow)'
                  : i % 3 === 1
                    ? 'var(--sticker-blue)'
                    : 'var(--sticker-green)',
            }}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#2D2D2D] bg-[var(--sticker-purple)] px-3 py-1.5 text-[10px] font-extrabold">
          <Trophy size={12} /> 7-day streak
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#2D2D2D] bg-[var(--sticker-yellow)] px-3 py-1.5 text-[10px] font-extrabold">
          <Sparkles size={12} /> Achievement unlocked
        </span>
      </div>
    </div>
  );
}
