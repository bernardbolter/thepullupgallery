'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define interfaces for our data structure
interface Location {
  title?: string;
  pullupLocation?: {
    lat?: number;
    lng?: number;
  };
  id?: string;
  slug?: string;
}

interface MapControllerProps {
  userLocation: [number, number] | null;
}

// Component to recenter the map based on user location
function MapController({ userLocation }: MapControllerProps) {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13);
    }
  }, [map, userLocation]);
  
  return null;
}

export interface LocationMapProps {
  locations: Location[];
  userLocation: [number, number] | null;
}

const LocationMap: React.FC<LocationMapProps> = ({ locations, userLocation }) => {
  const [icon, setIcon] = useState<L.Icon | null>(null);
  
  // Berlin coordinates as default
  const berlinCoordinates: [number, number] = [52.5200, 13.4050];
  
  // Create Leaflet icon
  useEffect(() => {
    // Fix for Leaflet's default icon in Next.js
    const customIcon = new L.Icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    setIcon(customIcon);
  }, []);
  
  if (!icon) return <div className="w-full h-full flex items-center justify-center bg-gray-100">Loading map...</div>;
  
  return (
    <MapContainer 
      center={berlinCoordinates} 
      zoom={13}
      className="locationsMap-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController userLocation={userLocation} />
      
      {locations.map((location, index) => {
        // Skip locations without coordinates
        if (!location?.pullupLocation?.lat || !location?.pullupLocation?.lng) {
          return null;
        }
        
        return (
          <Marker 
            key={location.id || `location-${index}`}
            position={[location.pullupLocation.lat, location.pullupLocation.lng]}
            icon={icon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{location.title || 'Unnamed Location'}</h3>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default LocationMap;
