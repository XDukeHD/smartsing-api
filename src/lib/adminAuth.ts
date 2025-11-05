import { comparePassword } from './hashPassword';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME!;

export async function authenticateAdmin(email: string, password: string): Promise<boolean> {
  return email === ADMIN_EMAIL && await comparePassword(password, ADMIN_PASSWORD);
}

export function getAdminUser() {
  return { email: ADMIN_EMAIL, username: ADMIN_USERNAME };
}