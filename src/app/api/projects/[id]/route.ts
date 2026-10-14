import { NextRequest, NextResponse } from 'next/server';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { requireUserId } from '@/lib/auth/dal';
import { readBody, errorResponse, unauthorized, notFound, conflict, isUuid } from '@/lib/api';
import { projectUpdateSchema } from '@/lib/validation';
import { computeProgress } from '@/lib/progress';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isUuid(id)) return notFound();
    const userId = await requireUserId();
    if (!userId) return unauthorized();

    const { version, ...data } = await readBody(req, projectUpdateSchema);
    if (data.milestones) data.progress = computeProgress(data.milestones);

    const [row] = await db
      .update(projects)
      .set({
        ...data,
        updatedAt: new Date(),
        ...(version !== undefined ? { version: sql`${projects.version} + 1` } : {}),
      })
      .where(
        version !== undefined
          ? and(eq(projects.id, id), eq(projects.userId, userId), eq(projects.version, version))
          : and(eq(projects.id, id), eq(projects.userId, userId)),
      )
      .returning();

    if (!row) {
      if (version !== undefined) {
        const [existing] = await db
          .select({ id: projects.id })
          .from(projects)
          .where(and(eq(projects.id, id), eq(projects.userId, userId)))
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
    await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
