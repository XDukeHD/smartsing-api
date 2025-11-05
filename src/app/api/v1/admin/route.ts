import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, getAdminUser } from '@/lib/adminAuth';
import { generateToken, verifyToken } from '@/lib/auth';
import { setSessionCookie } from '@/lib/session';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (await authenticateAdmin(email, password)) {
    const admin = getAdminUser();
    const token = generateToken({ email: admin.email, username: admin.username });
    const cookie = setSessionCookie(token);
    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', cookie);
    return response;
  }
  return NextResponse.json({ success: false }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const cookies = request.headers.get('cookie') || '';
  const token = cookies.split(';').find(c => c.trim().startsWith('session='))?.split('=')[1];
  if (token) {
    const admin = getAdminUser();
    const payload = verifyToken(token);
    if (payload && payload.email === admin.email) {
      return NextResponse.json({ authenticated: true, user: admin });
    }
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}