import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { donationService } from '../../services/donationService';
import './CreateDonation.css';

const CreateDonation = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    quantity: '',
    latitude: '',
    longitude: '',
    expiryDateTime: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your current location. Please enter coordinates manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  // Check if user has access to this page
  if (user && user.role !== 'DONOR') {
    return (
      <div className="create-donation">
        <div className="container">
          <div className="access-denied">
            <div className="access-denied-icon">🚫</div>
            <h2>Access Denied</h2>
            <p>Only donors can create food donations. Please contact an administrator if you believe this is an error.</p>
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Debug: Check authentication status
      const token = localStorage.getItem('sharebite_token');
      const userData = localStorage.getItem('sharebite_user');
      console.log('Token exists:', !!token);
      console.log('User data:', userData ? JSON.parse(userData) : null);
      
      if (!token) {
        setError('You must be logged in to create a donation.');
        return;
      }

      // Transform the form data to match backend API format
      const donationData = {
        title: formData.title,
        description: formData.description || null,
        quantity: parseInt(formData.quantity, 10),
        expiryDateTime: formData.expiryDateTime,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      console.log('Sending donation data:', donationData);
      await donationService.createDonation(donationData);
      alert('Donation created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating donation:', error);
      
      // Handle 403 Forbidden specifically
      if (error.response?.status === 403) {
        setError('Access denied. You must be logged in as a DONOR to create donations.');
        return;
      }
      
      // Handle different types of errors
      if (error.response?.data?.details) {
        const details = error.response.data.details;
        const errorMessages = Object.values(details).join(', ');
        setError(errorMessages);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError('Failed to create donation. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-donation">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span className="page-icon">➕</span>
            Create New Donation
          </h1>
          <p className="page-description">
            Share your surplus food with those who need it most
          </p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="donation-form">
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., Fresh Organic Vegetables, Cooked Meals, Bread"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity" className="form-label">
                Quantity (number of items) *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., 10, 25, 50"
                min="1"
                max="10000"
                required
                disabled={loading}
              />
            </div>

            <div className="location-section">
              <div className="location-header">
                <h3>Pickup Location *</h3>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="btn btn-secondary location-btn"
                  disabled={loading}
                >
                  📍 Use My Current Location
                </button>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="latitude" className="form-label">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g., 40.7128"
                    step="any"
                    min="-90"
                    max="90"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="longitude" className="form-label">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g., -74.0060"
                    step="any"
                    min="-180"
                    max="180"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="expiryDateTime" className="form-label">
                Expiry Date & Time *
              </label>
              <input
                type="datetime-local"
                id="expiryDateTime"
                name="expiryDateTime"
                value={formData.expiryDateTime}
                onChange={handleChange}
                className="form-control"
                required
                disabled={loading}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Additional Details
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                placeholder="Any additional information about the food donation..."
                rows="4"
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Donation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDonation;