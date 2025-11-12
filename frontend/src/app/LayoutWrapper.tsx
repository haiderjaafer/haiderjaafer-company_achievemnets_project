'use client';

import { useEffect, useState } from 'react';
import ClientLayout from './ClientLayout';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [userData, setUserData] = useState<{
    userID: string;
    username: string;
    permission: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData({
            userID: data.user.id.toString(),
            username: data.user.username,
            permission: data.user.permission,
            role: data.user.role,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <ClientLayout userData={userData}>
      {children}
    </ClientLayout>
  );
}