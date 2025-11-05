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

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.username}</p>
    </div>
  );
}