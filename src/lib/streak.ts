export function calcLoginStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const logSet = new Set(dates);
  const today = new Date().toISOString().split('T')[0];
  const current = new Date();
  if (!logSet.has(today)) {
    current.setDate(current.getDate() - 1);
  }
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const dateStr = current.toISOString().split('T')[0];
    if (logSet.has(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
