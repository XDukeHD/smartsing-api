import dbConnect from '../database';
import Notification from '../models/notification';

export async function createNotification(data: { title: string; message: string; type: 'normal' | 'popup' }) {
  await dbConnect();
  const notification = new Notification(data);
  return await notification.save();
}

export async function getNotifications(limit?: number) {
  await dbConnect();
  return await Notification.find().sort({ createdAt: -1 }).limit(limit || 0);
}

export async function getNotificationById(id: string) {
  await dbConnect();
  return await Notification.findById(id);
}

export async function updateNotification(id: string, data: Partial<{ title: string; message: string; type: 'normal' | 'popup' }>) {
  await dbConnect();
  return await Notification.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
}

export async function deleteNotification(id: string) {
  await dbConnect();
  return await Notification.findByIdAndDelete(id);
}