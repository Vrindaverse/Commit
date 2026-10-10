import { NextRequest, NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/db';
import { loans } from '@/db/schema';
import { requireUserId } from '@/lib/auth/dal';
import { unauthorized } from '@/lib/api';

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const rows = await db
    .select()
    .from(loans)
    .where(eq(loans.userId, userId))
    .orderBy(desc(loans.date), desc(loans.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const body = await req.json();
  const { id: _, userId: __, createdAt: ___, updatedAt: ____, ...clean } = body;
  const row = await db.insert(loans).values({ ...clean, userId }).returning();
  return NextResponse.json(row[0], { status: 201 });
}
