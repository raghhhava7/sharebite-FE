import { api } from './api';

export const donationService = {
  // Create a new donation (DONOR only)
  createDonation: async (donationData) => {
    try {
      const response = await api.donations.create(donationData);
      return response;
    } catch (error) {
      throw error.message || 'Failed to create donation';
    }
  },

  // Get all available donations
  getAvailableDonations: async () => {
    try {
      const response = await api.donations.getAvailable();
      return response;
    } catch (error) {
      throw error.message || 'Failed to get available donations';
    }
  },

  // Find nearby donations
  findNearbyDonations: async (searchData) => {
    try {
      const response = await api.donations.getNearby(searchData);
      return response;
    } catch (error) {
      throw error.message || 'Failed to find nearby donations';
    }
  },

  // Reserve a donation (RECEIVER only)
  reserveDonation: async (donationId) => {
    try {
      const response = await api.donations.reserve(donationId);
      return response;
    } catch (error) {
      throw error.message || 'Failed to reserve donation';
    }
  },

  // Complete a donation (DONOR or ADMIN)
  completeDonation: async (donationId) => {
    try {
      const response = await api.donations.complete(donationId);
      return response;
    } catch (error) {
      throw error.message || 'Failed to complete donation';
    }
  },

  // Get my donations (DONOR only)
  getMyDonations: async () => {
    try {
      const response = await api.donations.getMyDonations();
      return response;
    } catch (error) {
      throw error.message || 'Failed to get my donations';
    }
  },

  // Get my reservations (RECEIVER only)
  getMyReservations: async () => {
    try {
      const response = await api.donations.getMyReservations();
      return response;
    } catch (error) {
      throw error.message || 'Failed to get my reservations';
    }
  },

  // Get donation by ID
  getDonationById: async (donationId) => {
    try {
      const response = await api.donations.getById(donationId);
      return response;
    } catch (error) {
      throw error.message || 'Failed to get donation details';
    }
  }
};