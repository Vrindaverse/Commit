import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { requireUserId } from '@/lib/auth/dal';
import { unauthorized } from '@/lib/api';

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const rows = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
  if (rows.length === 0) {
    const created = await db.insert(settings).values({ userId }).returning();
    return NextResponse.json(created[0]);
  }
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const body = await req.json();
  const rows = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
  if (rows.length === 0) {
    const created = await db.insert(settings).values({ userId, ...body }).returning();
    return NextResponse.json(created[0]);
  }
  const updated = await db.update(settings)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(settings.userId, userId))
    .returning();
  return NextResponse.json(updated[0]);
}
