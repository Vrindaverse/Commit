import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { journalEntries } from '@/db/schema';
import { requireUserId } from '@/lib/auth/dal';
import { unauthorized } from '@/lib/api';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const body = await req.json();
  const { id: _, userId: __, ...clean } = body;
  const [row] = await db
    .update(journalEntries)
    .set({ ...clean, updatedAt: new Date() })
    .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)))
    .returning();
  if (!row) return NextResponse.json({ error: 'Not found', code: 'NOT_FOUND' }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  await db.delete(journalEntries).where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
  return NextResponse.json({ success: true });
}
