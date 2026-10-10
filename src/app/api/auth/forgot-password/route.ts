import { NextRequest, NextResponse } from 'next/server';
import { readBody, errorResponse } from '@/lib/api';
import { forgotSchema } from '@/lib/validation';
import { issueOtp } from '@/lib/auth/otp';
import { setChallengeCookie } from '@/lib/auth/session';
import { findUserByEmail } from '@/lib/auth/users';
import { sendOtpEmail } from '@/lib/email/mailer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await readBody(req, forgotSchema);
    const user = await findUserByEmail(email);

    if (user) {
      const code = await issueOtp(user.id, 'password_reset');
      await setChallengeCookie(user.id, 'password_reset');
      await sendOtpEmail({ to: user.email, name: user.name, code, purpose: 'password_reset' });
    }

    const delayMs = process.env.NODE_ENV === 'production' ? 700 : 0;
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}