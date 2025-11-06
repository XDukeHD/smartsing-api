import { comparePassword } from './hashPassword';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!.trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!.trim();
const ADMIN_USERNAME = process.env.ADMIN_USERNAME!.trim();

export async function authenticateAdmin(email: string, password: string): Promise<boolean> {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;
}

export function getAdminUser() {
  return { email: ADMIN_EMAIL, username: ADMIN_USERNAME };
}