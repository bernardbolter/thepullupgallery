import { LoginCredentials, RegisterCredentials, User } from './types';

// Helper function to get the API base URL that works with locale routing
function getApiUrl(endpoint: string): string {
  // API routes should always be accessed from the root, not from the locale path
  return `/api/auth/${endpoint}`;
}

// Login with WordPress credentials via server-side API
export async function loginUser(credentials: LoginCredentials): Promise<User> {
  console.log('Logging in via server-side API');
  const response = await fetch(getApiUrl('login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to login');
  }
  
  return data.user;
}

// Register a new user via server-side API
export async function registerUser(credentials: RegisterCredentials): Promise<User | { externalRegistration: boolean; wordpressUrl: string }> {
  try {
    console.log('Attempting to register user via server-side API');
    
    const response = await fetch(getApiUrl('register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    // Check if the response indicates external registration is required
    if (response.ok && data.externalRegistration) {
      console.log('External registration required:', data.message);
      return {
        externalRegistration: true,
        wordpressUrl: data.wordpressUrl
      };
    }
    
    if (!response.ok) {
      console.error('Registration failed with status:', response.status);
      console.error('Error response:', data);
      throw new Error(data.error || 'Failed to register');
    }
    
    return data.user;
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error;
  }
}

// Get current user data via server-side API
export async function getUserData(): Promise<User> {
  const response = await fetch(getApiUrl('user'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('Failed to get user data:', data.error);
    throw new Error(data.error || 'Failed to get user data');
  }

  console.log('User data from API:', data.user);
  return data.user;
}

// Logout user via server-side API
export async function logoutUser(): Promise<void> {
  await fetch(getApiUrl('user'), {
    method: 'DELETE',
  });
}
