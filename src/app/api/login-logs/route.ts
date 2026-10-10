import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { loginLogs } from '@/db/schema';
import { requireUserId } from '@/lib/auth/dal';
import { unauthorized } from '@/lib/api';
import { calcLoginStreak } from '@/lib/streak';

async function getAllDates(userId: string): Promise<string[]> {
  const rows = await db.select({ date: loginLogs.date }).from(loginLogs).where(eq(loginLogs.userId, userId));
  return rows.map(r => r.date);
}

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const rows = await db.select().from(loginLogs).where(eq(loginLogs.userId, userId)).orderBy(loginLogs.createdAt);
  const dates = rows.map(r => r.date);
  const streak = calcLoginStreak(dates);
  return NextResponse.json({ logs: rows, streak });
}

export async function POST() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const today = new Date().toISOString().split('T')[0];
  const existing = await db.select().from(loginLogs).where(and(eq(loginLogs.userId, userId), eq(loginLogs.date, today)));
  if (existing.length > 0) {
    const streak = calcLoginStreak(await getAllDates(userId));
    return NextResponse.json({ log: existing[0], streak });
  }
  const [row] = await db.insert(loginLogs).values({ userId, date: today }).returning();
  const streak = calcLoginStreak(await getAllDates(userId));
  return NextResponse.json({ log: row, streak }, { status: 201 });
}
