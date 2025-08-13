import React, { useState } from 'react';
import { donationService } from '../../services/donationService';
import './NearbyDonations.css';

const NearbyDonations = () => {
  const [searchData, setSearchData] = useState({
    latitude: '',
    longitude: '',
    radius: '5'
  });
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchData({
            ...searchData,
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

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const searchParams = {
        latitude: parseFloat(searchData.latitude),
        longitude: parseFloat(searchData.longitude),
        radiusInMeters: parseFloat(searchData.radius) * 1000 // Convert km to meters
      };
      
      console.log('Sending search params:', searchParams);
      const data = await donationService.findNearbyDonations(searchParams);
      setDonations(data);
    } catch (error) {
      console.error('Error searching donations:', error);
      
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
        setError('Failed to search for nearby donations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReserveDonation = async (donationId) => {
    try {
      await donationService.reserveDonation(donationId);
      // Refresh the search results
      handleSearch({ preventDefault: () => {} });
      alert('Donation reserved successfully!');
    } catch (error) {
      console.error('Error reserving donation:', error);
      alert('Failed to reserve donation. Please try again.');
    }
  };

  return (
    <div className="nearby-donations">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span className="page-icon">📍</span>
            Find Nearby Donations
          </h1>
          <p className="page-description">
            Search for food donations in your area
          </p>
        </div>

        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <div className="location-section">
              <h3 className="section-title">Your Location</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="latitude" className="form-label">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    value={searchData.latitude}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g., 40.7128"
                    step="any"
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
                    value={searchData.longitude}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g., -74.0060"
                    step="any"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={getCurrentLocation}
                className="btn btn-secondary location-btn"
                disabled={loading}
              >
                📍 Use My Current Location
              </button>
            </div>

            <div className="radius-section">
              <div className="form-group">
                <label htmlFor="radius" className="form-label">
                  Search Radius (km) *
                </label>
                <select
                  id="radius"
                  name="radius"
                  value={searchData.radius}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={loading}
                >
                  <option value="1">1 km</option>
                  <option value="2">2 km</option>
                  <option value="5">5 km</option>
                  <option value="10">10 km</option>
                  <option value="20">20 km</option>
                  <option value="50">50 km</option>
                </select>
              </div>
            </div>

            <div className="search-actions">
              <button
                type="submit"
                className="btn btn-primary search-btn"
                disabled={loading}
              >
                {loading ? 'Searching...' : '🔍 Search Donations'}
              </button>
            </div>
          </form>
        </div>

        {hasSearched && (
          <div className="results-container">
            <h2 className="results-title">
              Search Results ({donations.length} found)
            </h2>

            {donations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No donations found</h3>
                <p>Try expanding your search radius or check back later.</p>
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
                      
                      {donation.distance && (
                        <div className="detail-item">
                          <span className="detail-icon">🚶</span>
                          <span className="detail-text">
                            Distance: {donation.distance.toFixed(1)} km
                          </span>
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
                      {donation.status === 'AVAILABLE' && (
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
        )}
      </div>
    </div>
  );
};

export default NearbyDonations;