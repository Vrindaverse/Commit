import { NextRequest, NextResponse } from 'next/server';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { subjects } from '@/db/schema';
import { requireUserId } from '@/lib/auth/dal';
import { readBody, errorResponse, unauthorized, notFound, conflict, isUuid } from '@/lib/api';
import { subjectUpdateSchema } from '@/lib/validation';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isUuid(id)) return notFound();
    const userId = await requireUserId();
    if (!userId) return unauthorized();

    const { version, ...data } = await readBody(req, subjectUpdateSchema);
    const [row] = await db
      .update(subjects)
      .set({
        ...data,
        updatedAt: new Date(),
        ...(version !== undefined ? { version: sql`${subjects.version} + 1` } : {}),
      })
      .where(
        version !== undefined
          ? and(eq(subjects.id, id), eq(subjects.userId, userId), eq(subjects.version, version))
          : and(eq(subjects.id, id), eq(subjects.userId, userId)),
      )
      .returning();

    if (!row) {
      if (version !== undefined) {
        const [existing] = await db
          .select({ id: subjects.id })
          .from(subjects)
          .where(and(eq(subjects.id, id), eq(subjects.userId, userId)))
          .limit(1);
        if (existing) return conflict();
      }
      return notFound();
    }
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
    await db.delete(subjects).where(and(eq(subjects.id, id), eq(subjects.userId, userId)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
