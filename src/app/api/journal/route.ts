import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { journalEntries } from '@/db/schema';
import { requireUserId } from '@/lib/auth/dal';
import { readBody, errorResponse, unauthorized } from '@/lib/api';
import { journalCreateSchema } from '@/lib/validation';

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  try {
    const rows = await db.select().from(journalEntries).where(eq(journalEntries.userId, userId)).orderBy(journalEntries.createdAt);
    return NextResponse.json(rows);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  try {
    const data = await readBody(req, journalCreateSchema);
    const row = await db.insert(journalEntries).values({ ...data, userId }).returning();
    return NextResponse.json(row[0], { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
