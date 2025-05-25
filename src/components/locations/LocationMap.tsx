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
  selectedLocation: Location | null;
}

// Component to recenter the map based on user location or selected location
function MapController({ userLocation, selectedLocation }: MapControllerProps) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedLocation?.pullupLocation?.lat && selectedLocation?.pullupLocation?.lng) {
      // Priority to selected location
      map.setView(
        [selectedLocation.pullupLocation.lat, selectedLocation.pullupLocation.lng], 
        15
      );
    } else if (userLocation) {
      // Fall back to user location if no selected location
      map.setView(userLocation, 13);
    }
  }, [map, userLocation, selectedLocation]);
  
  return null;
}

export interface LocationMapProps {
  locations: Location[];
  userLocation: [number, number] | null;
  selectedLocation: Location | null;
}

const LocationMap: React.FC<LocationMapProps> = ({ locations, userLocation, selectedLocation }) => {
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
      
      <MapController userLocation={userLocation} selectedLocation={selectedLocation} />
      
      {locations.map((location, index) => {
        console.log(location);
        // Skip locations without coordinates
        if (!location?.pullupLocation?.lat || !location?.pullupLocation?.lng) {
          return null;
        }
        
        // Check if this is the selected location to use a different icon or style
        const isSelected = selectedLocation?.id === location.id;
        
        return (
          <Marker 
            key={location.id || `location-${index}`}
            position={[location.pullupLocation.lat, location.pullupLocation.lng]}
            icon={icon}
            opacity={isSelected ? 1 : 0.7}
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
