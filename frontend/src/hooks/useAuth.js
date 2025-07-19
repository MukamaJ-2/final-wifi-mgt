import { useState, useCallback } from 'react';
import api, { endpoints } from '../config/api';

export const useAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    admin: null,
    loading: false
  });

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    const adminData = localStorage.getItem('adminData');

    if (!token || !adminData) {
      setAuthState({
        isAuthenticated: false,
        admin: null,
        loading: false
      });
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const response = await api.get(endpoints.auth.profile);
      
      if (response.data.success) {
        setAuthState({
          isAuthenticated: true,
          admin: response.data.data.admin,
          loading: false
        });
      } else {
        throw new Error('Invalid session');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminData');
      setAuthState({
        isAuthenticated: false,
        admin: null,
        loading: false
      });
    }
  }, []);

  // Register admin
  const register = async (email, password, confirmPassword) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      const response = await api.post(endpoints.auth.register, {
        email,
        password,
        confirmPassword
      });

      setAuthState(prev => ({ ...prev, loading: false }));

      if (response.data.success) {
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    }
  };

  // Login admin
  const login = async (email, password) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      const response = await api.post(endpoints.auth.login, {
        email,
        password
      });

      if (response.data.success) {
        const { token, admin } = response.data.data;
        
        // Store auth data
        localStorage.setItem('authToken', token);
        localStorage.setItem('adminData', JSON.stringify(admin));

        setAuthState({
          isAuthenticated: true,
          admin,
          loading: false
        });

        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  // Logout admin
  const logout = async () => {
    try {
      await api.post(endpoints.auth.logout);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state regardless of API call result
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminData');
      setAuthState({
        isAuthenticated: false,
        admin: null,
        loading: false
      });
    }
  };

  return {
    authState,
    register,
    login,
    logout,
    checkAuthStatus
  };
};