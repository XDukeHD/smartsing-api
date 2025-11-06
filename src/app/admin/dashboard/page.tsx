'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = { email: string; username: string };

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/v1/admin')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      });
  }, [router]);

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="text-gray-600">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, <span className="font-semibold text-gray-800">{user.username}</span></p>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <h3 className="font-medium text-blue-800">Manage Users</h3>
                <p className="text-blue-600 text-sm">View and edit user accounts</p>
              </div>
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <h3 className="font-medium text-green-800">View Reports</h3>
                <p className="text-green-600 text-sm">Access system reports</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
                <h3 className="font-medium text-purple-800">Settings</h3>
                <p className="text-purple-600 text-sm">Configure application settings</p>
              </div>
              <div className="bg-red-50 p-4 rounded-md border border-red-200 cursor-pointer" onClick={() => router.push('/admin/dashboard/notifications')}>
                <h3 className="font-medium text-red-800">Notifications</h3>
                <p className="text-red-600 text-sm">Manage app notifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}