import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {getTranslations} from 'next-intl/server';

// Define supported locales
const locales = ['en', 'es', 'fr', 'de', 'nl'];

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Validate that the locale is supported
  const { locale } = await params;
  
  if (!locales.includes(locale)) {
    notFound();
  }

  // Load messages for the current locale
  let messages;
  try {
    messages = (await import(`../../messages/${locale}/common.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC" now={new Date()}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}