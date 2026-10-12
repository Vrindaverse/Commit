import 'server-only';

import { cookies } from 'next/headers';
import { and, eq, gt } from 'drizzle-orm';
import { db } from '@/db';
import { sessions, users } from '@/db/schema';
import {
  SESSION_COOKIE,
  CHALLENGE_COOKIE,
  SESSION_TTL_MS,
  CHALLENGE_TTL_MS,
  IS_PROD,
} from './config';
import {
  signSessionToken,
  verifySessionToken,
  signChallengeToken,
  verifyChallengeToken,
  type ChallengePurpose,
} from './token';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: Date;
}

export async function createSession(userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const [row] = await db.insert(sessions).values({ userId, expiresAt }).returning({ id: sessions.id });
  const token = await signSessionToken({ sid: row.id, uid: userId }, SESSION_TTL_MS);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: IS_PROD,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
  cookieStore.delete(CHALLENGE_COOKIE);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const payload = await verifySessionToken(token);
  if (payload) {
    await db.delete(sessions).where(eq(sessions.id, payload.sid));
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ sessionId: string; user: AuthenticatedUser } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const rows = await db
    .select({
      sessionId: sessions.id,
      id: users.id,
      email: users.email,
      name: users.name,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, payload.sid), eq(sessions.userId, payload.uid), gt(sessions.expiresAt, new Date())))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return {
    sessionId: row.sessionId,
    user: {
      id: row.id,
      email: row.email,
      name: row.name,
      emailVerified: row.emailVerified,
      createdAt: row.createdAt,
    },
  };
}

export async function setChallengeCookie(userId: string, purpose: ChallengePurpose): Promise<void> {
  const token = await signChallengeToken({ uid: userId, purpose }, CHALLENGE_TTL_MS);
  const cookieStore = await cookies();
  cookieStore.set(CHALLENGE_COOKIE, token, {
    httpOnly: true,
    secure: IS_PROD,
    expires: new Date(Date.now() + CHALLENGE_TTL_MS),
    sameSite: 'lax',
    path: '/',
  });
}

export async function getChallenge(): Promise<{ uid: string; purpose: ChallengePurpose } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CHALLENGE_COOKIE)?.value;
  return verifyChallengeToken(token);
}

export async function clearChallengeCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CHALLENGE_COOKIE);
}

export async function deleteAllSessionsForUser(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}
