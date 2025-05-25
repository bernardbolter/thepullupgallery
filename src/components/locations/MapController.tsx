'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapControllerProps {
  userLocation: [number, number] | null;
}

export default function MapController({ userLocation }: MapControllerProps) {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13);
    }
  }, [map, userLocation]);
  
  return null;
}
