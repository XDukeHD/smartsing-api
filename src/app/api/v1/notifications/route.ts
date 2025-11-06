import { NextResponse } from 'next/server';
import { getNotifications } from '@/lib/actions/notificationActions';

export async function GET() {
  try {
    const notifications = await getNotifications(5);
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}