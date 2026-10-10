import 'server-only';

import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { and, desc, eq, isNull, gt } from 'drizzle-orm';
import { db } from '@/db';
import { otpCodes } from '@/db/schema';
import {
  OTP_LENGTH,
  OTP_TTL_MS,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_MS,
  getSessionSecret,
} from './config';

export type OtpPurpose = 'email_verification' | 'login' | 'password_reset';

export class OtpError extends Error {
  code: 'COOLDOWN' | 'INVALID' | 'EXPIRED' | 'TOO_MANY_ATTEMPTS' | 'NOT_FOUND';
  constructor(code: OtpError['code'], message: string) {
    super(message);
    this.code = code;
  }
}

function hashOtp(code: string, userId: string, purpose: OtpPurpose): string {
  return createHmac('sha256', Buffer.from(getSessionSecret()))
    .update(`${userId}:${purpose}:${code}`)
    .digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function generateCode(): string {
  let code = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += randomInt(0, 10).toString();
  }
  return code;
}

export async function issueOtp(userId: string, purpose: OtpPurpose): Promise<string> {
  const recent = await db
    .select({ createdAt: otpCodes.createdAt })
    .from(otpCodes)
    .where(and(eq(otpCodes.userId, userId), eq(otpCodes.purpose, purpose)))
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  if (recent[0] && Date.now() - recent[0].createdAt.getTime() < OTP_RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((OTP_RESEND_COOLDOWN_MS - (Date.now() - recent[0].createdAt.getTime())) / 1000);
    throw new OtpError('COOLDOWN', `Please wait ${wait}s before requesting a new code.`);
  }

  await db.delete(otpCodes).where(and(eq(otpCodes.userId, userId), eq(otpCodes.purpose, purpose)));

  const code = generateCode();
  await db.insert(otpCodes).values({
    userId,
    purpose,
    codeHash: hashOtp(code, userId, purpose),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });
  return code;
}

export async function verifyOtp(userId: string, purpose: OtpPurpose, code: string): Promise<void> {
  const rows = await db
    .select()
    .from(otpCodes)
    .where(and(eq(otpCodes.userId, userId), eq(otpCodes.purpose, purpose), isNull(otpCodes.consumedAt)))
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  const record = rows[0];
  if (!record) {
    throw new OtpError('NOT_FOUND', 'No active code found. Please request a new one.');
  }
  if (record.expiresAt.getTime() < Date.now()) {
    await db.delete(otpCodes).where(eq(otpCodes.id, record.id));
    throw new OtpError('EXPIRED', 'This code has expired. Please request a new one.');
  }
  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    await db.delete(otpCodes).where(eq(otpCodes.id, record.id));
    throw new OtpError('TOO_MANY_ATTEMPTS', 'Too many attempts. Please request a new code.');
  }

  const expected = hashOtp(code, userId, purpose);
  if (!safeEqual(expected, record.codeHash)) {
    await db.update(otpCodes).set({ attempts: record.attempts + 1 }).where(eq(otpCodes.id, record.id));
    throw new OtpError('INVALID', 'That code is incorrect. Please try again.');
  }

  await db.update(otpCodes).set({ consumedAt: new Date() }).where(eq(otpCodes.id, record.id));
}

export async function hasActiveOtp(userId: string, purpose: OtpPurpose): Promise<boolean> {
  const rows = await db
    .select({ id: otpCodes.id })
    .from(otpCodes)
    .where(and(eq(otpCodes.userId, userId), eq(otpCodes.purpose, purpose), isNull(otpCodes.consumedAt), gt(otpCodes.expiresAt, new Date())))
    .limit(1);
  return rows.length > 0;
}
