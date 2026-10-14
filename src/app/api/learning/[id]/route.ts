import { NextRequest, NextResponse } from 'next/server';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { learningPaths } from '@/db/schema';
import { requireUserId } from '@/lib/auth/dal';
import { readBody, errorResponse, unauthorized, notFound, conflict, isUuid } from '@/lib/api';
import { learningUpdateSchema } from '@/lib/validation';
import { computeProgress } from '@/lib/progress';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isUuid(id)) return notFound();
    const userId = await requireUserId();
    if (!userId) return unauthorized();

    const { version, ...data } = await readBody(req, learningUpdateSchema);
    if (data.modules) data.progress = computeProgress(data.modules);

    const [row] = await db
      .update(learningPaths)
      .set({
        ...data,
        updatedAt: new Date(),
        ...(version !== undefined ? { version: sql`${learningPaths.version} + 1` } : {}),
      })
      .where(
        version !== undefined
          ? and(
              eq(learningPaths.id, id),
              eq(learningPaths.userId, userId),
              eq(learningPaths.version, version),
            )
          : and(eq(learningPaths.id, id), eq(learningPaths.userId, userId)),
      )
      .returning();

    if (!row) {
      if (version !== undefined) {
        const [existing] = await db
          .select({ id: learningPaths.id })
          .from(learningPaths)
          .where(and(eq(learningPaths.id, id), eq(learningPaths.userId, userId)))
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
    await db.delete(learningPaths).where(and(eq(learningPaths.id, id), eq(learningPaths.userId, userId)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
