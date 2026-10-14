import { NextRequest, NextResponse } from 'next/server';
import { requireUserId } from '@/lib/auth/dal';
import { destroyAllSessions } from '@/lib/auth/session';
import { errorResponse, unauthorized } from '@/lib/api';

export async function POST(_req: NextRequest) {
  try {
    const userId = await requireUserId();
    if (!userId) return unauthorized();
    await destroyAllSessions(userId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
