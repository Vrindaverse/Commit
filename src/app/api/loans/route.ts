import { NextRequest, NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/db';
import { loans } from '@/db/schema';
import { requireUserId } from '@/lib/auth/dal';
import { readBody, errorResponse, unauthorized } from '@/lib/api';
import { loanCreateSchema } from '@/lib/validation';

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  try {
    const rows = await db
      .select()
      .from(loans)
      .where(eq(loans.userId, userId))
      .orderBy(desc(loans.date), desc(loans.createdAt));
    return NextResponse.json(rows);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  try {
    const data = await readBody(req, loanCreateSchema);
    const row = await db.insert(loans).values({ ...data, userId }).returning();
    return NextResponse.json(row[0], { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
