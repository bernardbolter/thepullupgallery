import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

// Define locales and default locale
const locales = ['en', 'es', 'fr', 'de', 'nl'] as const;
const defaultLocale = 'en';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true
});

// Main middleware function
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle non-localized routes that should be redirected to localized versions
  if (
    // Only redirect specific pages, not static files or API routes
    (pathname === '/login' || pathname === '/register' || pathname === '/dashboard' || pathname === '/') &&
    // Don't redirect if it's already localized
    !locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
  ) {
    // Get preferred locale from request
    let locale = defaultLocale;
    const acceptLanguage = request.headers.get('accept-language');
    
    if (acceptLanguage) {
      // Parse the Accept-Language header to find a matching locale
      const preferredLocale = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].trim().split('-')[0])
        .find(lang => locales.includes(lang as any));
      
      if (preferredLocale) {
        locale = preferredLocale;
      }
    }
    
    // Create redirect URL with locale
    const url = new URL(request.url);
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    
    console.log(`Redirecting from ${pathname} to ${url.pathname}`);
    return NextResponse.redirect(url);
  }
  
  // For all other routes, use the next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Configure the middleware to run on specific paths, excluding static files
  matcher: [
    // Match specific routes that need redirects
    '/',
    '/login',
    '/register',
    '/dashboard',
    // Match all paths except static files, API routes, etc.
    '/((?!api|_next|static|.*\\..*).*)'
  ]
};
