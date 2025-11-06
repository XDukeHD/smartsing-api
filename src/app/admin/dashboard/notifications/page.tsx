'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Notification = {
  _id: string;
  title: string;
  message: string;
  type: 'normal' | 'popup';
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Notification | null>(null);
  const [formData, setFormData] = useState({ title: '', message: '', type: 'normal' });
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await fetch('/api/v1/admin/notifications');
    if (res.ok) {
      const data = await res.json();
      setNotifications(data);
    } else if (res.status === 401) {
      router.push('/admin/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/v1/admin/notifications/${editing._id}` : '/api/v1/admin/notifications';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      fetchNotifications();
      setShowForm(false);
      setEditing(null);
      setFormData({ title: '', message: '', type: 'normal' });
    }
  };

  const handleEdit = (notification: Notification) => {
    setEditing(notification);
    setFormData({ title: notification.title, message: notification.message, type: notification.type });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`/api/v1/admin/notifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchNotifications();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Notifications</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Create New Notification
          </button>
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border mb-2"
                required
              />
              <textarea
                placeholder="Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-2 border mb-2"
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'normal' | 'popup' })}
                className="w-full p-2 border mb-2"
              >
                <option value="normal">Normal</option>
                <option value="popup">Popup</option>
              </select>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                {editing ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                  setFormData({ title: '', message: '', type: 'normal' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </form>
          )}
          <ul>
            {notifications.map((notification) => (
              <li key={notification._id} className="border p-4 mb-2 rounded">
                <h3 className="font-bold">{notification.title}</h3>
                <p>{notification.message}</p>
                <p className="text-sm text-gray-500">Type: {notification.type}</p>
                <button
                  onClick={() => handleEdit(notification)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(notification._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}