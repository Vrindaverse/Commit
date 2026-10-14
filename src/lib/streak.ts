import { dateFromKey, localDateKey, todayKey } from '@/lib/date';

export function calcLoginStreak(dates: string[], today: string = todayKey()): number {
  if (dates.length === 0) return 0;
  const logSet = new Set(dates);
  const current = dateFromKey(today);
  if (!logSet.has(today)) {
    current.setDate(current.getDate() - 1);
  }
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const dateStr = localDateKey(current);
    if (logSet.has(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
