import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';
import { readBody, errorResponse, ApiError } from '@/lib/api';
import { verifyEmailSchema } from '@/lib/validation';
import { verifyOtp } from '@/lib/auth/otp';
import { createSession, getChallenge } from '@/lib/auth/session';
import { toPublicUser } from '@/lib/auth/users';
import { claimLegacyData } from '@/lib/auth/claim';

export async function POST(req: NextRequest) {
  try {
    const challenge = await getChallenge();
    if (!challenge) {
      throw new ApiError('No active verification found. Please sign up again.', 400, 'NO_CHALLENGE');
    }
    if (challenge.purpose !== 'email_verification') {
      throw new ApiError('This code is for a different step.', 400, 'WRONG_PURPOSE');
    }

    const { code } = await readBody(req, verifyEmailSchema);
    await verifyOtp(challenge.uid, 'email_verification', code);

    const [updated] = await db
      .update(users)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(users.id, challenge.uid))
      .returning();

    if (!updated) {
      throw new ApiError('Account not found.', 404, 'USER_NOT_FOUND');
    }

    await claimLegacyData(updated.id, updated.name, updated.email);
    await createSession(updated.id);

    return NextResponse.json({ ok: true, next: '/', user: toPublicUser(updated) });
  } catch (error) {
    return errorResponse(error);
  }
}