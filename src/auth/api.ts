import { LoginCredentials, RegisterCredentials, User } from './types';
import { env } from '@/env';

// Get WordPress URL from environment variables
const WP_API_URL = env.WORDPRESS_URL;

// Login with WordPress credentials
export async function loginUser(credentials: LoginCredentials): Promise<User> {
  const response = await fetch(`${WP_API_URL}/wp-json/jwt-auth/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to login');
  }

  const data = await response.json();
  
  // Store the token in localStorage (client-side only)
  if (typeof window !== 'undefined') {
    localStorage.setItem('wp_token', data.token);
  }
  
  // Get user data
  return getUserData(data.token);
}

// Register a new user
export async function registerUser(credentials: RegisterCredentials): Promise<User> {
  const response = await fetch(`${WP_API_URL}/wp-json/wp/v2/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
      first_name: credentials.firstName,
      last_name: credentials.lastName,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to register');
  }

  // After registration, log the user in
  return loginUser({
    username: credentials.username,
    password: credentials.password,
  });
}

// Get current user data
export async function getUserData(token?: string): Promise<User> {
  let authToken = token;
  
  // If no token is provided, try to get it from localStorage (client-side only)
  if (!authToken && typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('wp_token');
    if (storedToken) {
      authToken = storedToken;
    }
  }
  
  if (!authToken) {
    throw new Error('No authentication token found');
  }

  // Use context=edit to get all user data (including email and roles)
  const response = await fetch(`${WP_API_URL}/wp-json/wp/v2/users/me?context=edit`, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to get user data:', error);
    throw new Error('Failed to get user data');
  }

  const userData = await response.json();
  console.log('User data from API:', userData);
  return userData;
}

// Logout user
export async function logoutUser(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('wp_token');
  }
  // You might want to call a WordPress logout endpoint if available
}
