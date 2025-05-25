'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SelectLocationProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect?: (location: any) => void;
}

// Component to handle map clicks and set marker
function LocationMarker({ setPosition, position }: { setPosition: (pos: [number, number]) => void, position: [number, number] | null }) {
  const [icon, setIcon] = useState<L.Icon | null>(null);
  
  // Create Leaflet icon
  useEffect(() => {
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

  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position && icon ? (
    <Marker position={position} icon={icon} />
  ) : null;
}

export default function SelectLocation({ isOpen, onClose }: SelectLocationProps) {
  const t = useTranslations('Locations');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Berlin coordinates as default map center
  const berlinCoordinates: [number, number] = [52.5200, 13.4050];

  // Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create location object
    const newLocation = {
      title,
      description,
      pullupLocation: position ? {
        lat: position[0],
        lng: position[1]
      } : null,
      image
    };
    
    console.log('New location:', newLocation);
    // Here you would typically send this data to your API
    
    // Reset form and close modal
    setTitle('');
    setDescription('');
    setPosition(null);
    setImage(null);
    setImagePreview(null);
    onClose();
  };

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
    <div className={`select-location__container ${isOpen ? 'open' : ''}`}>
      <div className="select-location__header">
        <h2>{t('addNewLocation')}</h2>
        <button 
          className="select-location__close-button"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      
      <div className="select-location__content">
        <form onSubmit={handleSubmit} className="select-location__form">
          <div className="select-location__form-group">
            <label htmlFor="location-title">{t('locationTitle')}</label>
            <input
              id="location-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="select-location__input"
              placeholder={t('enterLocationTitle')}
            />
          </div>
          
          <div className="select-location__form-group">
            <label htmlFor="location-description">{t('locationDescription')}</label>
            <textarea
              id="location-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="select-location__textarea"
              placeholder={t('enterLocationDescription')}
              rows={3}
            />
          </div>
          
          <div className="select-location__form-group">
            <label>{t('selectOnMap')}</label>
            <div className="select-location__map-container">
              <MapContainer 
                center={berlinCoordinates} 
                zoom={13}
                className="select-location__map"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker setPosition={setPosition} position={position} />
              </MapContainer>
            </div>
          </div>
          
          {position && (
            <div className="select-location__coordinates">
              <div className="select-location__form-group">
                <label htmlFor="location-lat">{t('latitude')}</label>
                <input
                  id="location-lat"
                  type="text"
                  value={position[0]}
                  readOnly
                  className="select-location__input"
                />
              </div>
              
              <div className="select-location__form-group">
                <label htmlFor="location-lng">{t('longitude')}</label>
                <input
                  id="location-lng"
                  type="text"
                  value={position[1]}
                  readOnly
                  className="select-location__input"
                />
              </div>
            </div>
          )}
          
          <div className="select-location__form-group">
            <label htmlFor="location-image">{t('locationImage')}</label>
            <input
              id="location-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="select-location__file-input"
            />
            
            {imagePreview && (
              <div className="select-location__image-preview">
                <img src={imagePreview} alt="Location preview" />
              </div>
            )}
          </div>
          
          <div className="select-location__form-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="select-location__cancel-button"
            >
              {t('cancel')}
            </button>
            <button 
              type="submit" 
              className="select-location__submit-button"
              disabled={!position || !title}
            >
              {t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
