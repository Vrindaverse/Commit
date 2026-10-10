import { NextRequest, NextResponse } from 'next/server';
import { readBody, errorResponse, ApiError } from '@/lib/api';
import { otpFormSchema } from '@/lib/validation';
import { verifyOtp } from '@/lib/auth/otp';
import { createSession, getChallenge } from '@/lib/auth/session';
import { findUserById, toPublicUser } from '@/lib/auth/users';

export async function POST(req: NextRequest) {
  try {
    const challenge = await getChallenge();
    if (!challenge) {
      throw new ApiError('No active sign-in found. Please sign in again.', 400, 'NO_CHALLENGE');
    }
    if (challenge.purpose !== 'login') {
      throw new ApiError('This code is for a different step. Please sign in again.', 400, 'WRONG_PURPOSE');
    }

    const { code } = await readBody(req, otpFormSchema);
    await verifyOtp(challenge.uid, 'login', code);

    const user = await findUserById(challenge.uid);
    if (!user) {
      throw new ApiError('Account not found.', 404, 'USER_NOT_FOUND');
    }

    await createSession(user.id);

    return NextResponse.json({ ok: true, next: '/', user: toPublicUser(user) });
  } catch (error) {
    return errorResponse(error);
  }
}