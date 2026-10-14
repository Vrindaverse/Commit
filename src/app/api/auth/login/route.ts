import { NextRequest, NextResponse } from 'next/server';
import { readBody, errorResponse, ApiError } from '@/lib/api';
import { loginSchema } from '@/lib/validation';
import { verifyPasswordOrDummy } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { findUserByEmail } from '@/lib/auth/users';
import { toPublicUser } from '@/lib/auth/users';
import {
  checkRateLimit,
  clientIp,
  rateLimited,
  rateLimitKey,
  recordRateLimit,
  LOGIN_EMAIL_LIMIT,
  LOGIN_IP_LIMIT,
} from '@/lib/auth/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await readBody(req, loginSchema);

    const emailKey = rateLimitKey('login:email', email.trim().toLowerCase());
    const ipKey = rateLimitKey('login:ip', clientIp(req));

    const emailBlocked = await checkRateLimit(emailKey, LOGIN_EMAIL_LIMIT);
    const ipBlocked = await checkRateLimit(ipKey, LOGIN_IP_LIMIT);
    if (emailBlocked !== null || ipBlocked !== null) {
      return rateLimited(emailBlocked ?? ipBlocked ?? 1);
    }

    const user = await findUserByEmail(email);
    const valid = await verifyPasswordOrDummy(password, user?.passwordHash ?? null);

    if (!user || !valid) {
      await Promise.all([
        recordRateLimit(emailKey, LOGIN_EMAIL_LIMIT.windowMs),
        recordRateLimit(ipKey, LOGIN_IP_LIMIT.windowMs),
      ]);
      throw new ApiError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    await createSession(user.id);

    return NextResponse.json({ ok: true, next: '/', user: toPublicUser(user) });
  } catch (error) {
    return errorResponse(error);
  }
}