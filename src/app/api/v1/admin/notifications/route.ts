import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/verifyAdmin';
import { createNotification, getNotifications } from '@/lib/actions/notificationActions';

export async function GET(request: NextRequest) {
  const cookies = request.headers.get('cookie') || '';
  const token = cookies.split(';').find(c => c.trim().startsWith('session='))?.split('=')[1];
  if (!token || !verifyAdminSession(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const notifications = await getNotifications();
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const cookies = request.headers.get('cookie') || '';
  const token = cookies.split(';').find(c => c.trim().startsWith('session='))?.split('=')[1];
  if (!token || !verifyAdminSession(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, message, type } = await request.json();
    if (!title || !message || !type || !['normal', 'popup'].includes(type)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    const notification = await createNotification({ title, message, type });
    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}