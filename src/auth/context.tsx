'use client';

import React, { createContext, useReducer, useEffect } from 'react';
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
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

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
        // Only run on client side
        if (typeof window === 'undefined') {
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }
        
        const token = localStorage.getItem('wp_token');
        
        if (!token) {
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }
        
        const userData = await getUserData(token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      } catch (error) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('wp_token');
        }
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
    
    try {
      const userData = await registerUser(credentials);
      dispatch({ type: 'REGISTER_SUCCESS', payload: userData });
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
