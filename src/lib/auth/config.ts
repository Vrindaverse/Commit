export const SESSION_COOKIE = 'lifeos_session';
export const CHALLENGE_COOKIE = 'lifeos_challenge';

export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
export const CHALLENGE_TTL_MS = 1000 * 60 * 15;

export const OTP_LENGTH = 6;
export const OTP_TTL_MS = 1000 * 60 * 10;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_MS = 1000 * 60;

export const IS_PROD = process.env.NODE_ENV === 'production';

export function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('SESSION_SECRET is missing or too short (min 16 chars).');
  }
  return new TextEncoder().encode(secret);
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}
