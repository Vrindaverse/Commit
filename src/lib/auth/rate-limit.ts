import 'server-only';

import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { authRateLimits } from '@/db/schema';

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export const LOGIN_EMAIL_LIMIT: RateLimitConfig = { limit: 5, windowMs: 15 * 60_000 };
export const LOGIN_IP_LIMIT: RateLimitConfig = { limit: 20, windowMs: 15 * 60_000 };
export const SIGNUP_IP_LIMIT: RateLimitConfig = { limit: 10, windowMs: 60 * 60_000 };

export function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

export function rateLimitKey(scope: string, value: string): string {
  const digest = createHash('sha256').update(value).digest('hex').slice(0, 32);
  return `${scope}:${digest}`;
}

async function readWindow(key: string): Promise<{ count: number; resetAt: Date } | null> {
  const rows = await db
    .select({ count: authRateLimits.count, resetAt: authRateLimits.resetAt })
    .from(authRateLimits)
    .where(eq(authRateLimits.key, key))
    .limit(1);
  return rows[0] ?? null;
}

function retryAfterSeconds(resetAt: Date): number {
  return Math.max(1, Math.ceil((resetAt.getTime() - Date.now()) / 1000));
}

export async function checkRateLimit(key: string, config: RateLimitConfig): Promise<number | null> {
  const row = await readWindow(key);
  if (!row) return null;
  if (row.resetAt.getTime() <= Date.now()) return null;
  if (row.count < config.limit) return null;
  return retryAfterSeconds(row.resetAt);
}

export async function recordRateLimit(key: string, windowMs: number): Promise<{ count: number; resetAt: Date }> {
  const now = new Date();
  const nextReset = new Date(now.getTime() + windowMs);
  const [row] = await db
    .insert(authRateLimits)
    .values({ key, count: 1, resetAt: nextReset })
    .onConflictDoUpdate({
      target: authRateLimits.key,
      set: {
        count: sql`CASE WHEN ${authRateLimits.resetAt} <= ${now} THEN 1 ELSE ${authRateLimits.count} + 1 END`,
        resetAt: sql`CASE WHEN ${authRateLimits.resetAt} <= ${now} THEN ${nextReset} ELSE ${authRateLimits.resetAt} END`,
      },
    })
    .returning({ count: authRateLimits.count, resetAt: authRateLimits.resetAt });
  return row!;
}

export async function consumeRateLimit(key: string, config: RateLimitConfig): Promise<number | null> {
  const row = await recordRateLimit(key, config.windowMs);
  if (row.count <= config.limit) return null;
  return retryAfterSeconds(row.resetAt);
}

export function rateLimited(retryAfter: number): NextResponse {
  return NextResponse.json(
    { error: 'Too many attempts. Please try again later.', code: 'RATE_LIMITED' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } },
  );
}
