import 'server-only';

import { cookies } from 'next/headers';
import { and, desc, eq, gt, inArray, lt } from 'drizzle-orm';
import { db } from '@/db';
import { sessions, users } from '@/db/schema';
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  IS_PROD,
} from './config';
import {
  signSessionToken,
  verifySessionToken,
} from './token';

const MAX_SESSIONS_PER_USER = 10;
const LAST_SEEN_THROTTLE_MS = 5 * 60 * 1000;

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: Date;
}

export async function createSession(userId: string): Promise<void> {
  const now = new Date();
  await db
    .delete(sessions)
    .where(and(eq(sessions.userId, userId), lt(sessions.expiresAt, now)));

  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const [row] = await db.insert(sessions).values({ userId, expiresAt }).returning({ id: sessions.id });

  const active = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .orderBy(desc(sessions.createdAt));

  if (active.length > MAX_SESSIONS_PER_USER) {
    const stale = active.slice(MAX_SESSIONS_PER_USER).map((s) => s.id);
    await db.delete(sessions).where(inArray(sessions.id, stale));
  }

  const token = await signSessionToken({ sid: row.id, uid: userId }, SESSION_TTL_MS);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: IS_PROD,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
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

export async function destroyAllSessions(userId: string): Promise<void> {
  const cookieStore = await cookies();
  await db.delete(sessions).where(eq(sessions.userId, userId));
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
      lastSeenAt: sessions.lastSeenAt,
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

  if (Date.now() - row.lastSeenAt.getTime() > LAST_SEEN_THROTTLE_MS) {
    await db.update(sessions).set({ lastSeenAt: new Date() }).where(eq(sessions.id, row.sessionId));
  }

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
