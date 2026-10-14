import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { loans } from '@/db/schema';
import { requireUserId } from '@/lib/auth/dal';
import { readBody, errorResponse, unauthorized, notFound, isUuid } from '@/lib/api';
import { loanUpdateSchema } from '@/lib/validation';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isUuid(id)) return notFound();
    const userId = await requireUserId();
    if (!userId) return unauthorized();

    const data = await readBody(req, loanUpdateSchema);
    const [row] = await db
      .update(loans)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(loans.id, id), eq(loans.userId, userId)))
      .returning();

    if (!row) return notFound();
    return NextResponse.json(row);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isUuid(id)) return notFound();
    const userId = await requireUserId();
    if (!userId) return unauthorized();
    await db.delete(loans).where(and(eq(loans.id, id), eq(loans.userId, userId)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
