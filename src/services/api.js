// API Service Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

// API Client Configuration
const apiClient = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('sharebite_token');
};

// Helper function to create authenticated headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${apiClient.baseURL}${endpoint}`;
  const config = {
    method: 'GET',
    headers: {
      ...apiClient.headers,
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), apiClient.timeout);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// API Methods
export const api = {
  // Health Check
  health: () => apiRequest('/health'),
  version: () => apiRequest('/version'),

  // Authentication
  auth: {
    login: (credentials) => apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    register: (userData) => apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  },

  // Donations
  donations: {
    getAvailable: () => apiRequest('/donations/available'),
    getById: (id) => apiRequest(`/donations/${id}`),
    create: (donation) => apiRequest('/donations', {
      method: 'POST',
      body: JSON.stringify(donation),
    }),
    getMyDonations: () => apiRequest('/donations/my-donations'),
    getMyReservations: () => apiRequest('/donations/my-reservations'),
    getNearby: (params) => apiRequest('/donations/nearby', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
    reserve: (id) => apiRequest(`/donations/${id}/reserve`, { method: 'POST' }),
    complete: (id) => apiRequest(`/donations/${id}/complete`, { method: 'POST' }),
  },

  // Volunteer Tasks
  volunteers: {
    getTasks: (status = null) => {
      const url = status ? `/volunteers/tasks?status=${status}` : '/volunteers/tasks';
      return apiRequest(url);
    },
    getMyTasks: () => apiRequest('/volunteers/tasks/my-tasks'),
    getTaskById: (taskId) => apiRequest(`/volunteers/tasks/${taskId}`),
    getTaskByDonation: (donationId) => apiRequest(`/volunteers/tasks/donation/${donationId}`),
    getAvailableTasksNearby: (params) => apiRequest('/volunteers/tasks/nearby', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
    acceptTask: (taskId) => apiRequest(`/volunteers/tasks/${taskId}/accept`, {
      method: 'POST',
    }),
    updateTaskStatus: (taskId, status) => apiRequest(`/volunteers/tasks/${taskId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),
    assignTask: (donationId, volunteerId) => apiRequest(`/volunteers/tasks/assign?volunteerId=${volunteerId}`, {
      method: 'POST',
      body: JSON.stringify({ donationId }),
    }),
  },

  // Admin
  admin: {
    getUsers: () => apiRequest('/admin/users'),
    updateUserStatus: (userId, isActive) => apiRequest(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ active: isActive }),
    }),
    getTasks: () => apiRequest('/admin/tasks'),
  },
};

// Error handling utility
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.message.includes('timeout')) {
    return 'Request timeout. Please check your connection and try again.';
  }
  
  if (error.message.includes('401')) {
    // Handle unauthorized - redirect to login
    localStorage.removeItem('sharebite_token');
    localStorage.removeItem('sharebite_user');
    window.location.href = '/login';
    return 'Session expired. Please log in again.';
  }
  
  if (error.message.includes('403')) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error.message.includes('404')) {
    return 'The requested resource was not found.';
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

export default api;