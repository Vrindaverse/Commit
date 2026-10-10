import 'server-only';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  emailVerified: boolean;
  createdAt: Date;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);
  return rows[0] ?? null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}
