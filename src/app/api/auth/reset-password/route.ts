import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users, otpCodes } from '@/db/schema';
import { readBody, errorResponse, ApiError } from '@/lib/api';
import { resetSchema } from '@/lib/validation';
import { verifyOtp } from '@/lib/auth/otp';
import { hashPassword } from '@/lib/auth/password';
import { createSession, getChallenge, deleteAllSessionsForUser } from '@/lib/auth/session';
import { toPublicUser } from '@/lib/auth/users';


export async function POST(req: NextRequest) {
  try {
    const challenge = await getChallenge();
    if (!challenge) {
      throw new ApiError('No active reset found. Please request a new code.', 400, 'NO_CHALLENGE');
    }
    if (challenge.purpose !== 'password_reset') {
      throw new ApiError('This code is for a different step.', 400, 'WRONG_PURPOSE');
    }

    const { code, password } = await readBody(req, resetSchema);
    await verifyOtp(challenge.uid, 'password_reset', code);

    const passwordHash = await hashPassword(password);
    const [updated] = await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, challenge.uid))
      .returning();

    if (!updated) {
      throw new ApiError('Account not found.', 404, 'USER_NOT_FOUND');
    }

    await db.delete(otpCodes).where(eq(otpCodes.userId, updated.id));
    await deleteAllSessionsForUser(updated.id);
    await createSession(updated.id);

    return NextResponse.json({ ok: true, next: '/', user: toPublicUser(updated) });
  } catch (error) {
    return errorResponse(error);
  }
}