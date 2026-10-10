import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';
import { readBody, errorResponse, ApiError } from '@/lib/api';
import { signupSchema } from '@/lib/validation';
import { hashPassword } from '@/lib/auth/password';
import { issueOtp } from '@/lib/auth/otp';
import { setChallengeCookie } from '@/lib/auth/session';
import { findUserByEmail } from '@/lib/auth/users';
import { sendOtpEmail } from '@/lib/email/mailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await readBody(req, signupSchema);
    const existing = await findUserByEmail(email);

    if (existing && existing.emailVerified) {
      throw new ApiError('An account with this email already exists.', 409, 'EMAIL_TAKEN');
    }

    const passwordHash = await hashPassword(password);

    let userId: string;
    if (existing) {
      const [updated] = await db
        .update(users)
        .set({ name, passwordHash, updatedAt: new Date() })
        .where(eq(users.id, existing.id))
        .returning({ id: users.id });
      userId = updated.id;
    } else {
      const [created] = await db
        .insert(users)
        .values({ name, email, passwordHash, emailVerified: false })
        .returning({ id: users.id });
      userId = created.id;
    }

    const code = await issueOtp(userId, 'email_verification');
    await setChallengeCookie(userId, 'email_verification');
    await sendOtpEmail({ to: email, name, code, purpose: 'email_verification' });

    return NextResponse.json({ ok: true, next: 'verify-email', email }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
