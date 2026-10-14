import 'server-only';

import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

let dummyHashPromise: Promise<string> | null = null;

function getDummyPasswordHash(): Promise<string> {
  if (!dummyHashPromise) {
    dummyHashPromise = bcrypt.hash('timing-equalization-placeholder', BCRYPT_ROUNDS);
  }
  return dummyHashPromise;
}

export async function verifyPasswordOrDummy(password: string, hash: string | null): Promise<boolean> {
  const target = hash ?? (await getDummyPasswordHash());
  const matches = await bcrypt.compare(password, target);
  return hash ? matches : false;
}
