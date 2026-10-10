import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { unauthorized, errorResponse } from '@/lib/api';
import { toPublicUser } from '@/lib/auth/users';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorized();
    }
    return NextResponse.json({ user: toPublicUser(session.user) });
  } catch (error) {
    return errorResponse(error);
  }
}