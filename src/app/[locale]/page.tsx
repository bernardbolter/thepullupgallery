'use client';

import {useTranslations} from 'next-intl';
import Link from 'next/link';
import {useParams} from 'next/navigation';

// Define supported locales
const locales = ['en', 'es', 'fr', 'de', 'nl'];

export default function HomePage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('Home');
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <p className="mb-6">{t('welcome')}</p>
      
      <div className="mt-8 pt-4 border-t">
        <h2 className="text-lg font-medium mb-2">{t('switchLanguage')}:</h2>
        <div className="flex gap-2 flex-wrap">
          {locales.map((lang) => (
            <Link 
              key={lang} 
              href={`/${lang}`}
              className={`px-3 py-1 border rounded ${
                locale === lang ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              {t(`languages.${lang}`)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}