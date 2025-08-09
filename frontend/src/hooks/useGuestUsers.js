import { useState, useEffect, useCallback } from 'react';
import api, { endpoints } from '../config/api';

export const useGuestUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch guest users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(endpoints.guestUsers.list);
      
      if (response.data.success) {
        setUsers(response.data.data.users);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      setError(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create guest user
  const createUser = async (baseUsername, password, expirationDays, adminEmail, fullName, email, phoneNumber) => {
    try {
      const response = await api.post(endpoints.guestUsers.create, {
        baseUsername,
        password,
        expirationDays,
        fullName,
        email,
        phoneNumber
      });

      if (response.data.success) {
        // Add the new user to the list with the plain password for display
        const newUser = {
          ...response.data.data.user,
          plainPassword: response.data.data.plainPassword
        };
        setUsers(prev => [newUser, ...prev]);
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Create user error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create user' 
      };
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId) => {
    try {
      const response = await api.patch(endpoints.guestUsers.toggleStatus(userId));
      
      if (response.data.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, is_active: response.data.data.isActive }
            : user
        ));
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Toggle user status error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to update user status' 
      };
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      const response = await api.delete(endpoints.guestUsers.delete(userId));
      
      if (response.data.success) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Delete user error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to delete user' 
      };
    }
  };

  // Update user expiration
  const updateUserExpiration = async (userId, newExpirationDate) => {
    try {
      const response = await api.put(endpoints.guestUsers.update(userId), {
        expiresAt: newExpirationDate.toISOString()
      });
      
      if (response.data.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, expires_at: newExpirationDate.toISOString() }
            : user
        ));
        return { success: true };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Update user expiration error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to update user expiration' 
      };
    }
  };

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    createUser,
    toggleUserStatus,
    deleteUser,
    updateUserExpiration,
    refreshUsers: fetchUsers
  };
};