import { api } from './api';

export const volunteerService = {
  // Assign volunteer to donation (ADMIN or DONOR)
  assignTask: async (donationId, volunteerId) => {
    try {
      const response = await api.volunteers.assignTask(donationId, volunteerId);
      return response;
    } catch (error) {
      throw error.message || 'Failed to assign volunteer task';
    }
  },

  // Update task status (VOLUNTEER only)
  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await api.volunteers.updateTaskStatus(taskId, status);
      return response;
    } catch (error) {
      throw error.message || 'Failed to update task status';
    }
  },

  // Get my tasks (VOLUNTEER only)
  getMyTasks: async () => {
    try {
      const response = await api.volunteers.getMyTasks();
      return response;
    } catch (error) {
      throw error.message || 'Failed to get my tasks';
    }
  },

  // Get all tasks (ADMIN only)
  getAllTasks: async (status = null) => {
    try {
      const response = await api.volunteers.getTasks(status);
      return response;
    } catch (error) {
      throw error.message || 'Failed to get all tasks';
    }
  },

  // Get task by donation ID
  getTaskByDonation: async (donationId) => {
    try {
      const response = await api.volunteers.getTaskByDonation(donationId);
      return response;
    } catch (error) {
      throw error.message || 'Failed to get task by donation';
    }
  },

  // Get task by ID
  getTaskById: async (taskId) => {
    try {
      const response = await api.volunteers.getTaskById(taskId);
      return response;
    } catch (error) {
      throw error.message || 'Failed to get task details';
    }
  },

  // Get available tasks nearby (for volunteers to see and accept)
  getAvailableTasksNearby: async (searchData) => {
    try {
      const response = await api.volunteers.getAvailableTasksNearby(searchData);
      return response;
    } catch (error) {
      throw error.message || 'Failed to get available tasks nearby';
    }
  },

  // Accept a task (volunteer accepts an available task)
  acceptTask: async (taskId) => {
    try {
      const response = await api.volunteers.acceptTask(taskId);
      return response;
    } catch (error) {
      throw error.message || 'Failed to accept task';
    }
  }
};