'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function MainNavigation() {
    const t = useTranslations('Navigation');
    const pathname = usePathname();

    // Extract locale from pathname
    const getLocaleFromPathname = (path: string) => {
        const parts = path.split('/');
        return parts[1] || '';
    };

    const locale = getLocaleFromPathname(pathname);

    return (
        <nav className="main-nav__container">
            <Link href={`/${locale}`} className="main-nav__link">The Pullup Gallery</Link>
            <Link href={`/${locale}/ar`} className="main-nav__link">AR</Link>
            <Link href={`/${locale}/artists`} className="main-nav__link">Artists</Link>
            <Link href={`/${locale}/locations`} className="main-nav__link">Locations</Link>
        </nav>
    );
}