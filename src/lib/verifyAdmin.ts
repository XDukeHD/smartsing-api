import { verifyToken } from './auth';
import { getAdminUser } from './adminAuth';

export function verifyAdminSession(token: string): boolean {
  const payload = verifyToken(token);
  if (!payload) return false;
  const admin = getAdminUser();
  return payload.email === admin.email && payload.username === admin.username;
}