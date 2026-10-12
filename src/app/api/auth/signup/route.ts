import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { readBody, errorResponse, ApiError } from '@/lib/api';
import { signupSchema } from '@/lib/validation';
import { hashPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { findUserByEmail } from '@/lib/auth/users';
import { toPublicUser } from '@/lib/auth/users';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await readBody(req, signupSchema);
    const existing = await findUserByEmail(email);

    if (existing) {
      throw new ApiError('An account with this email already exists.', 409, 'EMAIL_TAKEN');
    }

    const passwordHash = await hashPassword(password);

    const [created] = await db
      .insert(users)
      .values({ name, email, passwordHash, emailVerified: true })
      .returning();

    await createSession(created.id);

    return NextResponse.json({ ok: true, next: '/', user: toPublicUser(created) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
