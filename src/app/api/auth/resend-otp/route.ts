import { NextRequest, NextResponse } from 'next/server';
import { errorResponse, ApiError } from '@/lib/api';
import { issueOtp } from '@/lib/auth/otp';
import { getChallenge } from '@/lib/auth/session';
import { findUserById } from '@/lib/auth/users';
import { sendOtpEmail } from '@/lib/email/mailer';

export async function POST(_req: NextRequest) {
  try {
    const challenge = await getChallenge();
    if (!challenge) {
      throw new ApiError('No active request found. Please start over.', 400, 'NO_CHALLENGE');
    }

    const user = await findUserById(challenge.uid);
    if (!user) {
      throw new ApiError('Account not found.', 404, 'USER_NOT_FOUND');
    }

    const code = await issueOtp(user.id, challenge.purpose);
    await sendOtpEmail({ to: user.email, name: user.name, code, purpose: challenge.purpose });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}