'use client';

import { useTranslations } from 'next-intl';

interface Artist {
  id?: string;
  title?: string;
  slug?: string;
}

interface ArtistsClientProps {
  initialArtists?: Artist[] | null;
}

export default function ArtistsClient({ initialArtists }: ArtistsClientProps) {
  const t = useTranslations('Artists');

  // Handle loading and error states
  if (!initialArtists) {
    return <div className="text-center py-8">{t('loading')}</div>;
  }

  if (!Array.isArray(initialArtists) || initialArtists.length === 0) {
    return <div className="text-center py-8">{t('noArtists')}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialArtists.map((artist, index) => (
          <div 
            key={artist?.id || `artist-${index}`} 
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{artist?.title || t('unnamedArtist')}</h2>
            {artist?.slug && (
              <a 
                href={`/artists/${artist.slug}`}
                className="text-blue-600 hover:underline inline-block mt-2"
              >
                {t('viewProfile')}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}