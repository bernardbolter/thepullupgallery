'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/auth/hooks';

interface ExternalRegistrationProps {
  className?: string;
}

export const ExternalRegistration: React.FC<ExternalRegistrationProps> = ({ className }) => {
  const t = useTranslations('Auth');
  const { externalRegistrationUrl } = useAuth();

  if (!externalRegistrationUrl) {
    return null;
  }

  const handleRedirect = () => {
    // Open the WordPress registration page in a new tab
    window.open(externalRegistrationUrl, '_blank');
  };

  return (
    <div className={`p-4 bg-blue-50 border border-blue-200 rounded-md ${className || ''}`}>
      <h3 className="text-lg font-medium text-blue-800 mb-2">
        {t.rich('externalRegistrationTitle')}
      </h3>
      <p className="text-blue-700 mb-4">
        {t.rich('externalRegistrationMessage')}
      </p>
      <button
        onClick={handleRedirect}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        {t.rich('externalRegistrationButton')}
      </button>
    </div>
  );
};

export default ExternalRegistration;
