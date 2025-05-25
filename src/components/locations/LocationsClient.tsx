'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MainNavigation from '@/components/navigation/MainNavigation';
import type { LocationMapProps } from '@/components/locations/LocationMap';
import LocationButton from '@/components/locations/LocationButton';

// Define interfaces for our data structure
interface Location {
  title?: string;
  pullupLocation?: {
    lat?: number;
    lng?: number;
  };
  pullupLocationDetails?: {
    address?: string;
    openingHours?: string;
    contact?: string;
    website?: string;
  };
  id?: string;
  slug?: string;
}

interface LocationsClientProps {
  initialLocations?: Location[] | null;
}

// Dynamically import the Map component with no SSR
const LocationMap = dynamic<LocationMapProps>(
  () => import('@/components/locations/LocationMap').then((mod) => mod.default),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
        Loading map...
      </div>
    )
  }
);

export default function LocationsClient({ initialLocations }: LocationsClientProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  // Get user location on client side only
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);
  
  const t = useTranslations('Locations');

  // Handle loading and error states
  if (initialLocations === undefined) {
    return <div className="text-center py-8">{t('loading')}</div>;
  }
  
  if (initialLocations === null || !Array.isArray(initialLocations) || initialLocations.length === 0) {
    return <div className="text-center py-8">{t('noLocations')}</div>;
  }
  
  // At this point, TypeScript knows initialLocations is Location[]
  return (
    <div className="locations-client__container">
      <MainNavigation />
      <LocationMap locations={initialLocations} userLocation={userLocation} />
      <LocationButton />
    </div>
  );
}