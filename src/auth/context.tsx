'use client';

import React, { createContext, useReducer, useEffect, useState } from 'react';
import { AuthContextType, AuthState, LoginCredentials, RegisterCredentials } from './types';
import { getUserData, loginUser, logoutUser, registerUser } from './api';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: any }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_SUCCESS'; payload: any }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
  externalRegistrationUrl: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [externalRegistrationUrl, setExternalRegistrationUrl] = useState<string | null>(null);

  // Log user info when authentication state changes
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      console.log('User is logged in:', state.user);
      console.log('User roles:', state.user.roles);
      console.log('User email:', state.user.email);
    } else if (!state.isLoading) {
      console.log('User is not logged in');
    }
  }, [state.isAuthenticated, state.user, state.isLoading]);

  // Check if user is already logged in on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Set loading state
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Get user data from server - this will use the HTTP cookie automatically
        const userData = await getUserData();
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      } catch (error) {
        // If error, user is not authenticated
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Session expired. Please login again.' });
      }
    };
    
    loadUser();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const userData = await loginUser(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    setExternalRegistrationUrl(null); // Reset external registration URL
    
    try {
      const result = await registerUser(credentials);
      
      // Check if the result indicates external registration is required
      if ('externalRegistration' in result && result.externalRegistration) {
        console.log('External registration required');
        setExternalRegistrationUrl(result.wordpressUrl);
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      
      // Normal registration flow
      dispatch({ type: 'REGISTER_SUCCESS', payload: result });
    } catch (error: any) {
      dispatch({ type: 'REGISTER_FAILURE', payload: error.message });
    }
  };

  // Logout function
  const logout = async () => {
    await logoutUser();
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
        externalRegistrationUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
