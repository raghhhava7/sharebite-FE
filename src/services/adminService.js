import { api } from './api';

export const adminService = {
  // Get all users (ADMIN only)
  getAllUsers: async () => {
    try {
      const response = await api.admin.getUsers();
      return response;
    } catch (error) {
      throw error.message || 'Failed to get all users';
    }
  },

  // Update user status (ADMIN only)
  updateUserStatus: async (userId, isActive) => {
    try {
      const response = await api.admin.updateUserStatus(userId, isActive);
      return response;
    } catch (error) {
      throw error.message || 'Failed to update user status';
    }
  },

  // Get all tasks (ADMIN only)
  getAllTasks: async () => {
    try {
      const response = await api.admin.getTasks();
      return response;
    } catch (error) {
      throw error.message || 'Failed to get all tasks';
    }
  }
};