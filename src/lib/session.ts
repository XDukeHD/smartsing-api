import { serialize, parse } from 'cookie';

export function setSessionCookie(token: string): string {
  return serialize('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60,
    path: '/',
  });
}

export function getSessionToken(cookies: string): string | null {
  const parsed = parse(cookies || '');
  return parsed.session || null;
}

export function clearSessionCookie(): string {
  return serialize('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}