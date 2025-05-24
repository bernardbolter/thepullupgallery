'use client';

import { useAuth } from '@/auth/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const t = useTranslations('Dashboard');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Only render dashboard content if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('title', { defaultMessage: 'Dashboard' })}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{t('welcome', { defaultMessage: 'Welcome' })}, {user?.name || user?.username}!</h2>
        <p className="text-gray-600 mb-4">
          {t('dashboardDescription', { 
            defaultMessage: 'This is your personal dashboard. You can access this page because you are logged in with your WordPress account.'
          })}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">{t('accountInfo', { defaultMessage: 'Account Information' })}</h3>
          <ul className="space-y-2">
            <li><strong>{t('username', { defaultMessage: 'Username' })}:</strong> {user?.username}</li>
            <li><strong>{t('email', { defaultMessage: 'Email' })}:</strong> {user?.email}</li>
            <li><strong>{t('roles', { defaultMessage: 'Roles' })}:</strong> {user?.roles.join(', ')}</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">{t('actions', { defaultMessage: 'Quick Actions' })}</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
              {t('editProfile', { defaultMessage: 'Edit Profile' })}
            </button>
            <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors">
              {t('viewContent', { defaultMessage: 'View My Content' })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
