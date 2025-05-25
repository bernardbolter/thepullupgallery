'use client'

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function LocationButton() {
    const t = useTranslations('Locations');
    const locale = usePathname();
    const [locationsListOpen, setLocationsListOpen] = useState(false);

    return (
        <div 
            className="location-button__container"
            onClick={() => setLocationsListOpen(!locationsListOpen)}
        >
            <p>Locations List</p>
        </div>
    );
}
