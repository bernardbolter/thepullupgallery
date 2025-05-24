'use client';

// Check if code is running on the client side
export const isClient = typeof window !== 'undefined';

// Get the stored token
export const getToken = (): string | null => {
  if (!isClient) return null;
  return localStorage.getItem('wp_token');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Create authenticated fetch function
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };
  
  return fetch(url, {
    ...options,
    headers,
  });
};
