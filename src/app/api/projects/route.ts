import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { requireUserId } from '@/lib/auth/dal';
import { readBody, errorResponse, unauthorized } from '@/lib/api';
import { projectCreateSchema } from '@/lib/validation';

export async function GET() {
  try {
    const userId = await requireUserId();
    if (!userId) return unauthorized();
    const rows = await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(projects.createdAt);
    return NextResponse.json(rows);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    if (!userId) return unauthorized();
    const data = await readBody(req, projectCreateSchema);
    const row = await db.insert(projects).values({ ...data, userId }).returning();
    return NextResponse.json(row[0], { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
