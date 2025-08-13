import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import './UserProfile.css';

const UserProfile = ({ isOpen, onClose, isStandalone = false }) => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    role: '',
    createdAt: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    bio: '',
    location: {
      latitude: null,
      longitude: null,
      address: ''
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        role: user.role || '',
        createdAt: user.createdAt || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        location: user.location || {
          latitude: null,
          longitude: null,
          address: ''
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'locationAddress') {
      setProfileData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          address: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setProfileData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            latitude,
            longitude
          }
        }));
        
        // Reverse geocoding to get address
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`)
          .then(response => response.json())
          .then(data => {
            if (data.results && data.results[0]) {
              setProfileData(prev => ({
                ...prev,
                location: {
                  ...prev.location,
                  address: data.results[0].formatted
                }
              }));
            }
          })
          .catch(() => {
            // Fallback if geocoding fails
            setProfileData(prev => ({
              ...prev,
              location: {
                ...prev.location,
                address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
              }
            }));
          })
          .finally(() => {
            setLoading(false);
            showSuccess('Location updated successfully');
          });
      },
      (error) => {
        setLoading(false);
        showError('Unable to retrieve your location');
      }
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to update profile
      // await userService.updateProfile(profileData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user context
      if (updateUser) {
        updateUser(profileData);
      }
      
      showSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      showError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        role: user.role || '',
        createdAt: user.createdAt || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        location: user.location || {
          latitude: null,
          longitude: null,
          address: ''
        }
      });
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'DONOR': return 'var(--color-sage)';
      case 'RECEIVER': return 'var(--color-navy)';
      case 'VOLUNTEER': return 'var(--color-orange)';
      case 'ADMIN': return 'var(--color-error)';
      default: return 'var(--color-gray-500)';
    }
  };

  const getInitials = (firstName, lastName, username) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  const profileContent = (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {getInitials(profileData.firstName, profileData.lastName, profileData.username)}
          </div>
        </div>
        
        <div className="profile-info">
          <h3 className="profile-name">
            {profileData.firstName && profileData.lastName 
              ? `${profileData.firstName} ${profileData.lastName}`
              : profileData.username
            }
          </h3>
          <div 
            className="profile-role"
            style={{ backgroundColor: getRoleColor(profileData.role) }}
          >
            {profileData.role}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <Card className="profile-details">
        <div className="profile-section">
          <h4 className="section-title">Account Information</h4>
          
          <div className="form-grid">
            <Input
              label="Username"
              name="username"
              value={profileData.username}
              onChange={handleInputChange}
              disabled={!isEditing}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              }
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              }
            />
          </div>
          
          <div className="form-grid">
            <Input
              label="First Name"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              }
            />
            
            <Input
              label="Last Name"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              }
            />
          </div>
        </div>

        <div className="profile-section">
          <h4 className="section-title">Contact Information</h4>
          
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={profileData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            }
          />
          
          <Input
            label="Address"
            name="address"
            value={profileData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            }
          />
        </div>

        <div className="profile-section">
          <h4 className="section-title">Location Settings</h4>
          
          <div className="location-section">
            <Input
              label="Manual Location"
              name="locationAddress"
              value={profileData.location.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your location manually"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              }
            />
            
            {isEditing && (
              <div className="location-actions">
                <Button
                  variant="outline"
                  size="small"
                  onClick={getCurrentLocation}
                  loading={loading}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="3,11 22,2 13,21 11,13 3,11"></polygon>
                    </svg>
                  }
                >
                  Get Current Location
                </Button>
              </div>
            )}
            
            {profileData.location.latitude && profileData.location.longitude && (
              <div className="location-info">
                <span className="location-coords">
                  Coordinates: {profileData.location.latitude.toFixed(6)}, {profileData.location.longitude.toFixed(6)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h4 className="section-title">About</h4>
          
          <div className="input-group">
            <label className="input-label">Bio</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="input-field textarea-field"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {profileData.createdAt && (
          <div className="profile-section">
            <div className="account-info">
              <span className="info-label">Member since:</span>
              <span className="info-value">
                {new Date(profileData.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="profile-actions">
        {!isEditing ? (
          <Button 
            variant="primary" 
            onClick={() => setIsEditing(true)}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            }
          >
            Edit Profile
          </Button>
        ) : (
          <div className="edit-actions">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              loading={loading}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              }
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // If standalone, render without modal wrapper
  if (isStandalone) {
    return (
      <div className="profile-page">
        <div className="profile-page-header">
          <h1>Profile Settings</h1>
          <p>Manage your account information and preferences</p>
        </div>
        {profileContent}
      </div>
    );
  }

  // Otherwise render as modal
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Profile Settings" 
      size="medium"
    >
      {profileContent}
    </Modal>
  );
};

export default UserProfile;