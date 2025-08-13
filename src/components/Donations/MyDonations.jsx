import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { donationService } from '../../services/donationService';
import './DonationList.css';

const MyDonations = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'DONOR') {
      fetchMyDonations();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMyDonations = async () => {
    try {
      setLoading(true);
      const data = await donationService.getMyDonations();
      setDonations(data);
    } catch (error) {
      console.error('Error fetching my donations:', error);
      setError('Failed to load your donations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDonation = async (donationId) => {
    try {
      await donationService.completeDonation(donationId);
      fetchMyDonations(); // Refresh the list
      alert('Donation marked as completed successfully!');
    } catch (error) {
      console.error('Error completing donation:', error);
      alert('Failed to complete donation. Please try again.');
    }
  };

  // Check if user has access to this page
  if (user && user.role !== 'DONOR') {
    return (
      <div className="donation-list">
        <div className="container">
          <div className="access-denied">
            <div className="access-denied-icon">🚫</div>
            <h2>Access Denied</h2>
            <p>This page is only available to donors. Please contact an administrator if you believe this is an error.</p>
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="donation-list">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner">Loading your donations...</div>
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
            <button onClick={fetchMyDonations} className="btn btn-primary">
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
            <span className="page-icon">📦</span>
            My Donations
          </h1>
          <p className="page-description">
            View and manage your food donations
          </p>
          <Link to="/create-donation" className="btn btn-primary">
            <span>➕</span>
            Create New Donation
          </Link>
        </div>

        {donations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No donations yet</h3>
            <p>You haven't created any food donations yet. Start making a difference by sharing your surplus food!</p>
            <Link to="/create-donation" className="btn btn-primary">
              Create Your First Donation
            </Link>
          </div>
        ) : (
          <div className="donations-grid">
            {donations.map((donation) => (
              <div key={donation.id} className="donation-card">
                <div className="donation-header">
                  <h3 className="donation-title">{donation.title}</h3>
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
                    <span className="detail-text">
                      Location: {donation.latitude}, {donation.longitude}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">⏰</span>
                    <span className="detail-text">
                      Expires: {new Date(donation.expiryDateTime).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span className="detail-text">
                      Created: {new Date(donation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {donation.receiverUsername && (
                    <div className="detail-item">
                      <span className="detail-icon">👤</span>
                      <span className="detail-text">Reserved by: {donation.receiverUsername}</span>
                    </div>
                  )}
                  
                  {donation.description && (
                    <div className="detail-item">
                      <span className="detail-icon">📝</span>
                      <span className="detail-text">{donation.description}</span>
                    </div>
                  )}
                </div>

                <div className="donation-actions">
                  {donation.status === 'RESERVED' && (
                    <button
                      onClick={() => handleCompleteDonation(donation.id)}
                      className="btn btn-success"
                    >
                      Mark as Completed
                    </button>
                  )}
                  
                  {donation.status === 'AVAILABLE' && (
                    <div className="available-info">
                      <span className="available-text">Available for pickup</span>
                    </div>
                  )}
                  
                  {donation.status === 'COMPLETED' && (
                    <div className="completed-info">
                      <span className="completed-text">✅ Completed</span>
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

export default MyDonations;