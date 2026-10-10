import { NextRequest, NextResponse } from 'next/server';
import { readBody, errorResponse, ApiError } from '@/lib/api';
import { loginSchema } from '@/lib/validation';
import { verifyPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { findUserByEmail } from '@/lib/auth/users';
import { toPublicUser } from '@/lib/auth/users';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await readBody(req, loginSchema);
    const user = await findUserByEmail(email);

    if (!user) {
      throw new ApiError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new ApiError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    await createSession(user.id);

    return NextResponse.json({ ok: true, next: '/', user: toPublicUser(user) });
  } catch (error) {
    return errorResponse(error);
  }
}