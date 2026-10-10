import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth/session';
import { errorResponse } from '@/lib/api';

export async function POST(_req: NextRequest) {
  try {
    await destroySession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}