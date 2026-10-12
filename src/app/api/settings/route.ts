import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { requireUserId } from '@/lib/auth/dal';
import { readBody, errorResponse, unauthorized } from '@/lib/api';
import { settingsUpdateSchema } from '@/lib/validation';

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  try {
    const rows = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
    if (rows.length > 0) return NextResponse.json(rows[0]);

    await db.insert(settings).values({ userId }).onConflictDoNothing();
    const created = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
    return NextResponse.json(created[0]);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  try {
    const data = await readBody(req, settingsUpdateSchema);
    const updated = await db
      .update(settings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(settings.userId, userId))
      .returning();
    if (updated[0]) return NextResponse.json(updated[0]);

    const created = await db
      .insert(settings)
      .values({ userId, ...data })
      .onConflictDoNothing()
      .returning();
    if (created[0]) return NextResponse.json(created[0]);

    const rows = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
    if (!rows[0]) return NextResponse.json({ error: 'Not found', code: 'NOT_FOUND' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return errorResponse(error);
  }
}
