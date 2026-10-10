import { NextRequest, NextResponse } from 'next/server';
import { readBody, errorResponse, ApiError } from '@/lib/api';
import { loginSchema } from '@/lib/validation';
import { verifyPassword } from '@/lib/auth/password';
import { issueOtp } from '@/lib/auth/otp';
import { setChallengeCookie } from '@/lib/auth/session';
import { findUserByEmail } from '@/lib/auth/users';
import { sendOtpEmail } from '@/lib/email/mailer';

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

    if (!user.emailVerified) {
      const code = await issueOtp(user.id, 'email_verification');
      await setChallengeCookie(user.id, 'email_verification');
      await sendOtpEmail({ to: user.email, name: user.name, code, purpose: 'email_verification' });
      return NextResponse.json({
        error: 'Verify your email before signing in.',
        code: 'EMAIL_NOT_VERIFIED',
        next: 'verify-email',
        email: user.email,
      }, { status: 403 });
    }

    const code = await issueOtp(user.id, 'login');
    await setChallengeCookie(user.id, 'login');
    await sendOtpEmail({ to: user.email, name: user.name, code, purpose: 'login' });

    return NextResponse.json({ ok: true, next: 'otp', email: user.email });
  } catch (error) {
    return errorResponse(error);
  }
}