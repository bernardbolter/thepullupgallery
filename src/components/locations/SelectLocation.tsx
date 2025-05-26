'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '@/auth/hooks';

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

  // Get current user information from auth context
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!title.trim()) {
      setSubmitError(t('enterLocationTitle'));
      return;
    }
    
    if (!isAuthenticated || !user) {
      setSubmitError(t('authRequired'));
      return;
    }
    
    if (!position) {
      setSubmitError(t('selectLocationOnMap'));
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // Create FormData object for multipart/form-data submission
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('latitude', position[0].toString());
      formData.append('longitude', position[1].toString());
      formData.append('userId', user.id.toString());
      
      // Add image if available
      if (image) {
        formData.append('image', image);
      }
      
      // Submit to API
      const response = await fetch('/api/locations', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('submitLocationError'));
      }
      
      const result = await response.json();
      console.log('Location submitted successfully:', result);
      setSubmitSuccess(true);
      
      // Reset form and close modal after a short delay
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setPosition(null);
        setImage(null);
        setImagePreview(null);
        setSubmitSuccess(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting location:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
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
          
          {submitError && (
            <div className="select-location__error-message">
              {submitError}
            </div>
          )}
          
          {submitSuccess && (
            <div className="select-location__success-message">
              {t('locationSubmitSuccess')}
            </div>
          )}
          
          <div className="select-location__form-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="select-location__cancel-button"
              disabled={isSubmitting}
            >
              {t('cancel')}
            </button>
            <button 
              type="submit" 
              className="select-location__submit-button"
              disabled={!position || !title || isSubmitting}
            >
              {isSubmitting ? t('submitting') : t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
