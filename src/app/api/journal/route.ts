import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { journalEntries } from '@/db/schema';
import { requireUserId } from '@/lib/auth/dal';
import { unauthorized } from '@/lib/api';

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const rows = await db.select().from(journalEntries).where(eq(journalEntries.userId, userId)).orderBy(journalEntries.createdAt);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const body = await req.json();
  const { id: _, userId: __, ...clean } = body;
  const row = await db.insert(journalEntries).values({ ...clean, userId }).returning();
  return NextResponse.json(row[0], { status: 201 });
}
