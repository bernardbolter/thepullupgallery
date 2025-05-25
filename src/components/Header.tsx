'use client';

import { useAuth } from '@/auth/hooks';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const t = useTranslations('Auth');
  const pathname = usePathname();
  
  // Extract locale from pathname
  const getLocaleFromPathname = (path: string) => {
    const parts = path.split('/');
    return parts[1] || '';
  };
  
  const locale = getLocaleFromPathname(pathname);

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={`/${locale}`} className="text-xl font-bold">
          The Pullup Gallery
        </Link>
        
        <nav>
          {isLoading ? (
            <div className="animate-pulse h-8 w-20 bg-blue-500 rounded"></div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span>{t('loggedInAs')} {user?.username}</span>
              <button 
                onClick={() => logout()}
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                {t('logout', { defaultMessage: 'Log Out' })}
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href={`/${locale}/login`} className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                {t('login', { defaultMessage: 'Log In' })}
              </Link>
              <Link href={`/${locale}/register`} className="bg-blue-500 text-white px-4 py-2 rounded border border-white hover:bg-blue-700 transition-colors">
                {t('register', { defaultMessage: 'Register' })}
              </Link>
            </div>
          )}
           <Link 
              href="/[locale]/artists" 
              as={`/${pathname.split('/')[1]}/artists`}
              className={`inline-flex items-center px-1 pt-1 border-b-2 ${pathname.includes('artists') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
            >
              {t('artists')}
            </Link>
            <Link 
              href="/[locale]/locations" 
              as={`/${pathname.split('/')[1]}/locations`}
              className={`inline-flex items-center px-1 pt-1 border-b-2 ${pathname.includes('locations') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
            >
              {t('locations')}
            </Link>
        </nav>
      </div>
    </header>
  );
}
