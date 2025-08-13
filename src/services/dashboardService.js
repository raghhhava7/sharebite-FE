import { api } from './api';

export const dashboardService = {
  // Get dashboard statistics based on user role
  getStats: async (userRole) => {
    try {
      let stats = {
        totalDonations: 0,
        activeDonations: 0,
        completedDonations: 0,
        totalRecipients: 0
      };

      switch (userRole) {
        case 'DONOR':
          // Get donor-specific stats
          const myDonations = await api.donations.getMyDonations();
          stats.totalDonations = myDonations.length;
          stats.activeDonations = myDonations.filter(d => d.status === 'AVAILABLE' || d.status === 'RESERVED').length;
          stats.completedDonations = myDonations.filter(d => d.status === 'COMPLETED').length;
          stats.totalRecipients = new Set(myDonations.filter(d => d.receiverUsername).map(d => d.receiverUsername)).size;
          break;

        case 'RECEIVER':
          // Get receiver-specific stats
          const myReservations = await api.donations.getMyReservations();
          const availableDonations = await api.donations.getAvailable();
          stats.totalDonations = availableDonations.length; // Available donations they can see
          stats.activeDonations = myReservations.filter(d => d.status === 'RESERVED').length;
          stats.completedDonations = myReservations.filter(d => d.status === 'COMPLETED').length;
          stats.totalRecipients = myReservations.length; // Their reservations count
          break;

        case 'VOLUNTEER':
          // Get volunteer-specific stats
          const myTasks = await api.volunteers.getMyTasks();
          stats.totalDonations = myTasks.length; // Total tasks assigned
          stats.activeDonations = myTasks.filter(t => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS').length;
          stats.completedDonations = myTasks.filter(t => t.status === 'COMPLETED').length;
          stats.totalRecipients = myTasks.length; // Tasks completed (people helped)
          break;

        case 'ADMIN':
          // Get admin overview stats - would need admin endpoints
          // For now, get available donations as a general overview
          const allDonations = await api.donations.getAvailable();
          stats.totalDonations = allDonations.length;
          stats.activeDonations = allDonations.filter(d => d.status === 'AVAILABLE').length;
          stats.completedDonations = 0; // Would need admin endpoint
          stats.totalRecipients = 0; // Would need admin endpoint
          break;

        default:
          break;
      }

      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default stats on error
      return {
        totalDonations: 0,
        activeDonations: 0,
        completedDonations: 0,
        totalRecipients: 0
      };
    }
  },

  // Get recent activity based on user role
  getRecentActivity: async (userRole, username) => {
    try {
      let activities = [];

      switch (userRole) {
        case 'DONOR':
          const myDonations = await api.donations.getMyDonations();
          activities = myDonations.slice(0, 5).map(donation => ({
            id: donation.id,
            title: `Donation: ${donation.title}`,
            description: `${donation.quantity} items - Status: ${donation.status}`,
            timestamp: new Date(donation.createdAt),
            icon: '🍽️',
            type: 'donation'
          }));
          break;

        case 'RECEIVER':
          const myReservations = await api.donations.getMyReservations();
          activities = myReservations.slice(0, 5).map(reservation => ({
            id: reservation.id,
            title: `Reserved: ${reservation.title}`,
            description: `From ${reservation.donorUsername} - Status: ${reservation.status}`,
            timestamp: new Date(reservation.updatedAt),
            icon: '🤝',
            type: 'reservation'
          }));
          break;

        case 'VOLUNTEER':
          const myTasks = await api.volunteers.getMyTasks();
          activities = myTasks.slice(0, 5).map(task => ({
            id: task.id,
            title: `Task: Delivery #${task.id}`,
            description: `Status: ${task.status}`,
            timestamp: new Date(task.assignedDate || task.createdAt),
            icon: '🚚',
            type: 'task'
          }));
          break;

        case 'ADMIN':
          // For admin, show general system activity
          activities = [
            {
              id: 1,
              title: 'System Overview',
              description: 'Monitoring platform activity',
              timestamp: new Date(),
              icon: '👑',
              type: 'admin'
            }
          ];
          break;

        default:
          break;
      }

      return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }
};