'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/auth/hooks';

// Define supported locales
const locales = ['en', 'es', 'fr', 'de', 'nl'];

export default function HomePage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('Home');
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600 mb-8">{t('welcome')}</p>
          
          {isAuthenticated ? (
            <div className="mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-2">{t('welcomeBack', { defaultMessage: 'Welcome back' })}, {user?.name || user?.username}!</h2>
                <p className="mb-4">{t('accountAccess', { defaultMessage: 'You are logged in and have access to all features.' })}</p>
                <Link 
                  href={`/${locale}/dashboard`}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {t('dashboard', { defaultMessage: 'Go to Dashboard' })}
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link 
                href={`/${locale}/login`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {t('login', { defaultMessage: 'Log In' })}
              </Link>
              <Link 
                href={`/${locale}/register`}
                className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                {t('register', { defaultMessage: 'Register' })}
              </Link>
            </div>
          )}
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-center">{t('switchLanguage')}:</h2>
          <div className="flex gap-3 flex-wrap justify-center">
            {locales.map((lang) => (
              <Link 
                key={lang} 
                href={`/${lang}`}
                className={`px-4 py-2 border rounded-md ${
                  locale === lang ? 'bg-blue-100 border-blue-300 font-medium' : 'hover:bg-gray-100'
                }`}
              >
                {t(`languages.${lang}`)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}