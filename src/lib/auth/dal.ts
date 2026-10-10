import 'server-only';

import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getSession, type AuthenticatedUser } from './session';

export const getCurrentUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const session = await getSession();
  return session?.user ?? null;
});

export const verifySession = cache(async (): Promise<AuthenticatedUser> => {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
});

export async function requireUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}
