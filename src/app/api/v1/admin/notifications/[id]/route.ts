import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/verifyAdmin';
import { updateNotification, deleteNotification, getNotificationById } from '@/lib/actions/notificationActions';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const cookies = request.headers.get('cookie') || '';
  const token = cookies.split(';').find(c => c.trim().startsWith('session='))?.split('=')[1];
  if (!token || !verifyAdminSession(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, message, type } = await request.json();
    const updateData: any = {};
    if (title) updateData.title = title;
    if (message) updateData.message = message;
    if (type && ['normal', 'popup'].includes(type)) updateData.type = type;
    const notification = await updateNotification(params.id, updateData);
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const cookies = request.headers.get('cookie') || '';
  const token = cookies.split(';').find(c => c.trim().startsWith('session='))?.split('=')[1];
  if (!token || !verifyAdminSession(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const notification = await deleteNotification(params.id);
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Notification deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}