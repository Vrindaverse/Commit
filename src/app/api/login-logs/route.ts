import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { loginLogs } from '@/db/schema';
import { requireUserId } from '@/lib/auth/dal';
import { errorResponse, unauthorized } from '@/lib/api';
import { calcLoginStreak } from '@/lib/streak';
import { addDaysToKey, daysBetweenKeys, isDateKey, todayKey } from '@/lib/date';

function serverDateKey(requested: unknown): string {
  const today = todayKey();
  if (!isDateKey(requested)) return today;
  const diff = daysBetweenKeys(today, requested);
  if (diff < -1 || diff > 1) return today;
  return addDaysToKey(today, diff);
}

async function getAllDates(userId: string): Promise<string[]> {
  const rows = await db.select({ date: loginLogs.date }).from(loginLogs).where(eq(loginLogs.userId, userId));
  return rows.map(r => r.date);
}

export async function GET(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  try {
    const requested = req.nextUrl.searchParams.get('today');
    const today = serverDateKey(requested);
    const rows = await db.select().from(loginLogs).where(eq(loginLogs.userId, userId)).orderBy(loginLogs.createdAt);
    const dates = rows.map(r => r.date);
    const streak = calcLoginStreak(dates, today);
    return NextResponse.json({ logs: rows, streak });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  try {
    let requested: unknown;
    try {
      requested = (await req.json())?.date;
    } catch {
      requested = undefined;
    }
    const date = serverDateKey(requested);

    const inserted = await db
      .insert(loginLogs)
      .values({ userId, date })
      .onConflictDoNothing()
      .returning();

    let log = inserted[0];
    if (!log) {
      const existing = await db
        .select()
        .from(loginLogs)
        .where(and(eq(loginLogs.userId, userId), eq(loginLogs.date, date)))
        .limit(1);
      log = existing[0];
    }

    const streak = calcLoginStreak(await getAllDates(userId), date);
    return NextResponse.json({ log, streak }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  try {
    const deleted = await db
      .delete(loginLogs)
      .where(eq(loginLogs.userId, userId))
      .returning({ id: loginLogs.id });
    return NextResponse.json({ success: true, deleted: deleted.length });
  } catch (error) {
    return errorResponse(error);
  }
}
