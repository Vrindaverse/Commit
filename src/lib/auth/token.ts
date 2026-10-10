import { SignJWT, jwtVerify } from 'jose';
import { getSessionSecret, CHALLENGE_TTL_MS } from './config';

export interface SessionTokenPayload {
  sid: string;
  uid: string;
}

export type ChallengePurpose = 'email_verification' | 'login' | 'password_reset';

export interface ChallengeTokenPayload {
  uid: string;
  purpose: ChallengePurpose;
}

export async function signSessionToken(payload: SessionTokenPayload, ttlMs: number): Promise<string> {
  return new SignJWT({ sid: payload.sid, uid: payload.uid })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor((Date.now() + ttlMs) / 1000))
    .sign(getSessionSecret());
}

export async function verifySessionToken(token?: string): Promise<SessionTokenPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), { algorithms: ['HS256'] });
    if (typeof payload.sid !== 'string' || typeof payload.uid !== 'string') return null;
    return { sid: payload.sid, uid: payload.uid };
  } catch {
    return null;
  }
}

export async function signChallengeToken(payload: ChallengeTokenPayload): Promise<string> {
  return new SignJWT({ uid: payload.uid, purpose: payload.purpose })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor((Date.now() + CHALLENGE_TTL_MS) / 1000))
    .sign(getSessionSecret());
}

export async function verifyChallengeToken(token?: string): Promise<ChallengeTokenPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), { algorithms: ['HS256'] });
    const purposes: ChallengePurpose[] = ['email_verification', 'login', 'password_reset'];
    if (typeof payload.uid !== 'string' || !purposes.includes(payload.purpose as ChallengePurpose)) {
      return null;
    }
    return { uid: payload.uid, purpose: payload.purpose as ChallengePurpose };
  } catch {
    return null;
  }
}
