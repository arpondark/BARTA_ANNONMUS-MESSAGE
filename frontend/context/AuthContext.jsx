'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import axiosInstance from '../utils/axiosConfig';
import { API_URL } from '../utils/config';

// Create the Auth Context
const AuthContext = createContext();

// API base URL - for constructing URLs that aren't API endpoints
const API_BASE_URL = API_URL.replace('/api', '');

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user profile data
  const fetchProfileData = async (token) => {
    try {
      console.log('Fetching profile data with token:', token);
      // Try multiple endpoints to support different API structures
      let response;
      try {
        response = await axiosInstance.get('/profile');
      } catch (firstError) {
        console.log('First profile fetch attempt failed, trying alternative endpoint');
        try {
          response = await axiosInstance.get('/user/profile');
        } catch (secondError) {
          console.log('Second profile fetch attempt failed, trying third endpoint');
          response = await axiosInstance.get('/api/user');
        }
      }

      console.log('Profile data retrieved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      return null;
    }
  };

  // Function to update user data with profile information
  const updateUserWithProfile = async (userData, token) => {
    const profileData = await fetchProfileData(token);

    if (profileData) {
      const updatedUserData = {
        ...userData,
        profilePicture: profileData.profilePicture ? `${API_BASE_URL}${profileData.profilePicture}` : null
      };

      setUser(updatedUserData);
      localStorage.setItem('user_data', JSON.stringify(updatedUserData));

      return updatedUserData;
    }

    return userData;
  };

  useEffect(() => {
    // Check for stored auth token on first load
    const authToken = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    // Also check cookies
    const cookieToken = Cookies.get('token');
    const cookieUsername = Cookies.get('username');

    if (authToken && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        setIsAuthenticated(true);

        // Update user data with profile information if needed
        if (!parsedUserData.profilePicture) {
          updateUserWithProfile(parsedUserData, authToken);
        }
      } catch (error) {
        console.error('Error parsing stored user data', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    } else if ((token && username) || (cookieToken && cookieUsername)) {
      // Handle the alternative authentication format
      const user = { username: username || cookieUsername };
      setUser(user);
      setIsAuthenticated(true);

      // Store in the AuthContext format for future consistency
      if (!authToken && token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));

        // Update user data with profile information
        updateUserWithProfile(user, token);
      }
    }

    setLoading(false);
  }, []);

  // Login function
  const login = async (username) => {
    try {
      // Try the standard endpoint first
      let response;
      try {
        console.log('Attempting login with endpoint: /auth/login');
        response = await axiosInstance.post('/auth/login', { username });
      } catch (firstError) {
        console.log('First login attempt failed, trying alternative endpoint');
        // If that fails, try the alternative endpoint
        response = await axiosInstance.post('/login', { username });
      }

      console.log('Login response:', response.data);

      // Handle different response formats
      const token = response.data.token || response.data.accessToken || response.data.access_token;
      if (!token) {
        console.error('No token found in response:', response.data);
        return { 
          success: false, 
          message: 'Login failed: No token returned from server'
        };
      }

      const userData = { username };

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      // Also set in the format used by existing pages for compatibility
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      setUser(userData);
      setIsAuthenticated(true);

      // Fetch and update user profile data
      await updateUserWithProfile(userData, token);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  // Logout function
  const logout = () => {
    // Remove all auth data from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Remove cookies if js-cookie is available
    if (typeof Cookies !== 'undefined') {
      try {
        Cookies.remove('token');
        Cookies.remove('username');
      } catch (error) {
        console.error('Error removing cookies:', error);
      }
    }

    setUser(null);
    setIsAuthenticated(false);
  };

  // Register function
  const register = async (username) => {
    try {
      // Try the standard endpoint first
      let response;
      try {
        console.log('Attempting registration with endpoint: /auth/register');
        response = await axiosInstance.post('/auth/register', { username });
      } catch (firstError) {
        console.log('First registration attempt failed, trying alternative endpoint');
        // If that fails, try the alternative endpoint
        response = await axiosInstance.post('/register', { username });
      }

      console.log('Register response:', response.data);

      // Handle different response formats
      const token = response.data.token || response.data.accessToken || response.data.access_token;
      if (!token) {
        console.error('No token found in response:', response.data);
        return { 
          success: false, 
          message: 'Registration failed: No token returned from server'
        };
      }

      const userData = { username };

      // Store in both formats for compatibility
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      setUser(userData);
      setIsAuthenticated(true);

      // Fetch and update user profile data
      await updateUserWithProfile(userData, token);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
