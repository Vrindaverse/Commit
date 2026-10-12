import { localDateKey } from '@/lib/date';

export interface HabitLog {
  date: string;
  count: number;
}

/**
 * Calculates the current streak of consecutive completed days ending today.
 *
 * A day counts as completed when it has at least one log entry with a
 * positive count. If today is not completed yet, the streak is measured
 * backwards from yesterday so an in-progress day does not reset it.
 */
export function calcStreak(logs: HabitLog[], today: Date = new Date()): number {
  const counts = new Map<string, number>();
  for (const log of logs) {
    if (!log || typeof log.date !== 'string') continue;
    const count = Number(log.count);
    if (!Number.isFinite(count) || count <= 0) continue;
    const existing = counts.get(log.date) ?? 0;
    if (count > existing) counts.set(log.date, count);
  }

  const cursor = new Date(today);
  if ((counts.get(localDateKey(cursor)) ?? 0) <= 0) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while ((counts.get(localDateKey(cursor)) ?? 0) > 0) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Whether a habit has been completed on the given date key. */
export function isHabitDoneOn(logs: HabitLog[], dateKey: string): boolean {
  return logs.some(l => l.date === dateKey && Number(l.count) > 0);
}

/** Sum of the given habit's logs, used as an "amount" for the day. */
export function habitCountOn(logs: HabitLog[], dateKey: string): number {
  return logs.reduce((sum, l) => (l.date === dateKey ? sum + (Number(l.count) || 0) : sum), 0);
}
