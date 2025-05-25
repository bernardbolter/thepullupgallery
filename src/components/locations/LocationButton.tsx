'use client'

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import LocationsList from './LocationsList';

interface Location {
  title?: string;
  pullupLocation?: {
    lat?: number;
    lng?: number;
  };
  lat?: number;
  lng?: number;
  pullupLocationDetails?: {
    address?: string;
    openingHours?: string;
    contact?: string;
    website?: string;
  };
  address?: string;
  openingHours?: string;
  contact?: string;
  website?: string;
  id?: string;
  slug?: string;
}

interface LocationButtonProps {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
}

export default function LocationButton({ locations, onLocationSelect }: LocationButtonProps) {
    const t = useTranslations('Locations');
    const locale = usePathname();
    const [locationsListOpen, setLocationsListOpen] = useState(false);

    const handleLocationSelect = (location: Location) => {
        onLocationSelect(location);
        setLocationsListOpen(false);
    };

    return (
        <>
            <div 
                className="location-button__container"
                onClick={() => setLocationsListOpen(!locationsListOpen)}
                aria-label={t('toggleLocationsList')}
                role="button"
            >
                <p>{t('locationsList')}</p>
            </div>

            <LocationsList 
                locations={locations} 
                isOpen={locationsListOpen} 
                onClose={() => setLocationsListOpen(false)}
                onLocationSelect={handleLocationSelect}
            />
        </>
    );
}
