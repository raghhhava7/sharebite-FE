import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { donationService } from '../../services/donationService';
import './DonationList.css';

const MyReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'RECEIVER') {
      fetchMyReservations();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMyReservations = async () => {
    try {
      setLoading(true);
      const data = await donationService.getMyReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching my reservations:', error);
      setError('Failed to load your reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check if user has access to this page
  if (user && user.role !== 'RECEIVER') {
    return (
      <div className="donation-list">
        <div className="container">
          <div className="access-denied">
            <div className="access-denied-icon">🚫</div>
            <h2>Access Denied</h2>
            <p>This page is only available to receivers. Please contact an administrator if you believe this is an error.</p>
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
            <div className="loading-spinner">Loading your reservations...</div>
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
            <button onClick={fetchMyReservations} className="btn btn-primary">
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
            <span className="page-icon">🤝</span>
            My Reservations
          </h1>
          <p className="page-description">
            View your reserved food donations
          </p>
          <Link to="/donations" className="btn btn-primary">
            <span>🔍</span>
            Browse More Donations
          </Link>
        </div>

        {reservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No reservations yet</h3>
            <p>You haven't reserved any food donations yet. Browse available donations to find food in your area!</p>
            <Link to="/donations" className="btn btn-primary">
              Browse Available Donations
            </Link>
          </div>
        ) : (
          <div className="donations-grid">
            {reservations.map((donation) => (
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
                    <span className="detail-icon">👤</span>
                    <span className="detail-text">Donor: {donation.donorUsername}</span>
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
                      Reserved: {new Date(donation.updatedAt).toLocaleDateString()}
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
                  {donation.status === 'RESERVED' && (
                    <div className="reserved-info">
                      <span className="reserved-text">✅ Reserved - Ready for pickup</span>
                      <p className="pickup-note">Please coordinate with the donor for pickup details.</p>
                    </div>
                  )}
                  
                  {donation.status === 'COMPLETED' && (
                    <div className="completed-info">
                      <span className="completed-text">✅ Completed - Thank you!</span>
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

export default MyReservations;