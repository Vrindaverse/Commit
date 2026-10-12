import type { Expense, Goal, Habit, LearningPath, Loan, Project, Task } from '@/types';
import { habitCountOn } from '@/lib/habits';
import { localDateKey } from '@/lib/date';

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const PRIORITY_ORDER = ['urgent', 'high', 'medium', 'low'] as const;

const SVG_W = 120;
const SVG_H = 32;

export interface DashboardDataset {
  tasks: Task[];
  goals: Goal[];
  projects: Project[];
  habits: Habit[];
  learningPaths: LearningPath[];
  expenses: Expense[];
  loans: Loan[];
}

export interface FinanceSummary {
  earnings: number;
  expenses: number;
  savings: number;
  rate: number;
  loanNet: number;
}

export interface DashboardStats {
  greeting: string;
  todayLabel: string;
  monthLabel: string;
  monthKey: string;
  todayKey: string;
  tasksDone: number;
  tasksPending: number;
  tasksTotal: number;
  completionRate: number;
  bestStreak: number;
  finance: FinanceSummary;
  topTasks: Task[];
  weeklyData: { day: string; tasks: number; completed: number }[];
  maxWeeklyTasks: number;
  trendData: { day: string; hours: number }[];
  maxHours: number;
  trendPoints: string;
  trendArea: string;
  goalCategories: { label: string; count: number; color: string }[];
  compulsoryHabits: Habit[];
  compulsoryDone: number;
}

/** Parses a `YYYY-MM-DD` key as a local date (avoids UTC off-by-one-day bugs). */
export function parseDateKey(value: string | undefined | null): Date | null {
  if (!value || typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match) {
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getGreeting(now: Date): string {
  const h = now.getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function computeFinance(expenses: Expense[], loans: Loan[], now: Date): FinanceSummary {
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  let earnings = 0;
  let monthExpenses = 0;
  for (const t of expenses) {
    if (!t.date?.startsWith(monthPrefix)) continue;
    const amt = Number(t.amount);
    if (!Number.isFinite(amt)) continue;
    if (t.type === 'income') earnings += amt;
    else monthExpenses += amt;
  }
  let loanNet = 0;
  for (const l of loans) {
    const principal = Number(l.principal);
    const paid = Number(l.paid);
    const outstanding = Math.max(0, (Number.isFinite(principal) ? principal : 0) - (Number.isFinite(paid) ? paid : 0));
    loanNet += l.kind === 'borrowed' ? -outstanding : outstanding;
  }
  const savings = earnings - monthExpenses;
  return {
    earnings,
    expenses: monthExpenses,
    savings,
    rate: earnings > 0 ? Math.round((savings / earnings) * 100) : 0,
    loanNet,
  };
}

/**
 * Computes every derived value the dashboard renders. Pure so it can run on
 * the server (streamed with the page) and be reused on the client.
 */
export function computeDashboardStats(dataset: DashboardDataset, now: Date = new Date()): DashboardStats {
  const { tasks, goals, habits, expenses, loans } = dataset;

  const done = tasks.filter(t => t.status === 'done').length;
  const total = tasks.length;

  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => Number(h.streak) || 0), 0) : 0;

  const finance = computeFinance(expenses, loans, now);

  const topTasks = [...tasks]
    .filter(t => t.status !== 'done')
    .sort((a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority))
    .slice(0, 5);

  const weeklyData = DAYS.map(d => {
    const dayTasks = tasks.filter(t => parseDateKey(t.dueDate)?.getDay() === DAYS.indexOf(d));
    return { day: d, tasks: dayTasks.length, completed: dayTasks.filter(t => t.status === 'done').length };
  });
  const maxWeeklyTasks = Math.max(...weeklyData.map(d => d.tasks), 1);

  const trendData = DAYS.map(d => {
    const dayTasks = tasks.filter(t => parseDateKey(t.dueDate)?.getDay() === DAYS.indexOf(d));
    return { day: d, hours: dayTasks.reduce((sum, t) => sum + (t.status === 'done' ? 2.5 : 1), 0) };
  });
  const maxHours = Math.max(...trendData.map(d => d.hours), 1);
  const trendPoints = trendData
    .map((d, i) => `${(i / (trendData.length - 1)) * SVG_W},${SVG_H - (d.hours / maxHours) * SVG_H}`)
    .join(' ');
  const trendArea =
    trendData
      .map((d, i) => `${(i / (trendData.length - 1)) * SVG_W},${SVG_H - (d.hours / maxHours) * SVG_H}`)
      .join(' ') + ` ${SVG_W},${SVG_H} 0,${SVG_H}`;

  const goalCategories = (['long-term', 'medium-term', 'short-term'] as const).map(cat => ({
    label: cat.replace('-', ' '),
    count: goals.filter(g => g.category === cat).length,
    color: cat === 'long-term' ? '#B8D8F8' : cat === 'medium-term' ? '#F7E8A4' : '#CDEAC0',
  }));

  const todayKey = localDateKey(now);
  const compulsoryHabits = habits.filter(h => h.category === 'compulsory');
  const compulsoryDone = compulsoryHabits.filter(h => habitCountOn(h.logs, todayKey) > 0).length;

  return {
    greeting: getGreeting(now),
    todayLabel: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    monthLabel: now.toLocaleDateString('en-US', { month: 'long' }),
    monthKey: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    todayKey,
    tasksDone: done,
    tasksPending: total - done,
    tasksTotal: total,
    completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
    bestStreak,
    finance,
    topTasks,
    weeklyData,
    maxWeeklyTasks,
    trendData,
    maxHours,
    trendPoints,
    trendArea,
    goalCategories,
    compulsoryHabits,
    compulsoryDone,
  };
}
