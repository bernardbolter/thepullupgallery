'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/auth/hooks';

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

interface LocationsListProps {
  locations: Location[];
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: Location) => void;
}

export default function LocationsList({ 
  locations, 
  isOpen, 
  onClose, 
  onLocationSelect 
}: LocationsListProps) {
  const t = useTranslations('Locations');
  const locale = usePathname();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(locations);

  // Filter locations when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLocations(locations);
      return;
    }

    const filtered = locations.filter(location => 
      location.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredLocations(filtered);
  }, [searchTerm, locations]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('.locations-list__container') && !target.closest('.location-button__container')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div className={`locations-list__container ${isOpen ? 'open' : ''}`}>
      <div className="locations-list__header">
        <h2>{t('locationsList')}</h2>
        <button 
          className="locations-list__close-button"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      
      <div className="locations-list__search">
        <input
          type="text"
          placeholder={t('searchLocations')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="locations-list__search-input"
        />
        {searchTerm && (
          <button 
            className="locations-list__clear-search"
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      
      <div className="locations-list__items">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((location, index) => (
            <div 
              key={location.id || index}
              className="locations-list__item"
              onClick={() => onLocationSelect(location)}
            >
              <h3>{location.title}</h3>
              {location.address && <p className="locations-list__address">{location.address}</p>}
            </div>
          ))
        ) : (
          <div className="locations-list__empty">
            <p>{t('noLocationsFound')}</p>
          </div>
        )}
      </div>
      
      <div className="locations-list__footer">
        {useAuth().isAuthenticated ? (
          <Link href={`/${locale}/add-location`} className="locations-list__add-button">
            {t('addNewLocation')}
          </Link>
        ) : (
          <div className="locations-list__login-prompt">
            <Link href="/login" className="locations-list__login-link">
              {t('loginOrRegister')} {t('toAddLocation')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
