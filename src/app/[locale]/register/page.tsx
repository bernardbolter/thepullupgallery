'use client';

import { useState } from 'react';
import { useAuth } from '@/auth/hooks';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const { register, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(credentials);
      router.push('/');
    } catch (err) {
      // Error is handled in the auth context
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">{t('register', { defaultMessage: 'Register' })}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">
            {t('username', { defaultMessage: 'Username' })}*
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            {t('email', { defaultMessage: 'Email' })}*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            {t('password', { defaultMessage: 'Password' })}*
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="firstName">
            {t('firstName', { defaultMessage: 'First Name' })}
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={credentials.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="lastName">
            {t('lastName', { defaultMessage: 'Last Name' })}
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={credentials.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? t('registering', { defaultMessage: 'Registering...' }) : t('register', { defaultMessage: 'Register' })}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p>
          {t('haveAccount', { defaultMessage: 'Already have an account?' })}{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            {t('login', { defaultMessage: 'Log In' })}
          </Link>
        </p>
      </div>
    </div>
  );
}
