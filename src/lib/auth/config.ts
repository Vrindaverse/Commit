export const SESSION_COOKIE = 'lifeos_session';

export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export const IS_PROD = process.env.NODE_ENV === 'production';

export function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET is missing or too short (min 32 chars).');
  }
  return new TextEncoder().encode(secret);
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}