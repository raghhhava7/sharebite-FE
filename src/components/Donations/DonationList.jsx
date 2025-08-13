import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { donationService } from '../../services/donationService';
import './DonationList.css';

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await donationService.getAvailableDonations();
      setDonations(data);
    } catch (error) {
      console.error('Error fetching donations:', error);
      setError('Failed to load donations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReserveDonation = async (donationId) => {
    try {
      await donationService.reserveDonation(donationId);
      // Refresh the list after reservation
      fetchDonations();
      alert('Donation reserved successfully!');
    } catch (error) {
      console.error('Error reserving donation:', error);
      alert('Failed to reserve donation. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="donation-list">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner">Loading donations...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="donation-list">
        <div className="container">
          <div className="error-container">
            <div className="error-message">{error}</div>
            <button onClick={fetchDonations} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-list">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span className="page-icon">🍽️</span>
            Available Donations
          </h1>
          <p className="page-description">
            Browse and reserve food donations available in your area
          </p>
        </div>

        {donations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No donations available</h3>
            <p>Check back later for new food donations in your area.</p>
          </div>
        ) : (
          <div className="donations-grid">
            {donations.map((donation) => (
              <div key={donation.id} className="donation-card">
                <div className="donation-header">
                  <h3 className="donation-title">{donation.foodType}</h3>
                  <span className={`status-badge ${donation.status?.toLowerCase()}`}>
                    {donation.status}
                  </span>
                </div>
                
                <div className="donation-details">
                  <div className="detail-item">
                    <span className="detail-icon">📦</span>
                    <span className="detail-text">Quantity: {donation.quantity}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">Location: {donation.location}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">⏰</span>
                    <span className="detail-text">
                      Expires: {new Date(donation.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {donation.description && (
                    <div className="detail-item">
                      <span className="detail-icon">📝</span>
                      <span className="detail-text">{donation.description}</span>
                    </div>
                  )}
                </div>

                <div className="donation-actions">
                  {user?.role === 'RECEIVER' && donation.status === 'AVAILABLE' && (
                    <button
                      onClick={() => handleReserveDonation(donation.id)}
                      className="btn btn-primary"
                    >
                      Reserve Donation
                    </button>
                  )}
                  
                  {donation.status === 'RESERVED' && (
                    <div className="reserved-info">
                      <span className="reserved-text">Reserved</span>
                    </div>
                  )}
                  
                  {donation.status === 'COMPLETED' && (
                    <div className="completed-info">
                      <span className="completed-text">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationList;