import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { volunteerService } from '../../services/volunteerService';
import './VolunteerTasks.css';

const VolunteerTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationSetup, setLocationSetup] = useState({
    latitude: '',
    longitude: '',
    radius: '10', // Default 10km radius
    isSetup: false
  });
  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' or 'available'

  // Haversine distance in kilometers
  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (
      lat1 == null || lon1 == null || lat2 == null || lon2 == null ||
      isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)
    ) {
      return null;
    }
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getTaskDistanceKm = (task) => {
    // Prefer server-provided distance for available tasks
    if (typeof task?.distance === 'number') {
      return task.distance;
    }
    // Compute from coordinates for assigned tasks
    const vLat = parseFloat(locationSetup.latitude);
    const vLon = parseFloat(locationSetup.longitude);
    const dLat = parseFloat(task?.donation?.latitude);
    const dLon = parseFloat(task?.donation?.longitude);
    return calculateDistanceKm(vLat, vLon, dLat, dLon);
  };

  const isWithinWorkingRadius = (task) => {
    if (!locationSetup.isSetup) return false;
    const distance = getTaskDistanceKm(task);
    if (distance == null) return false;
    const radiusKm = parseFloat(locationSetup.radius) || 0;
    return distance <= radiusKm + 1e-6; // epsilon
  };

  useEffect(() => {
    // Only fetch data if user is a volunteer
    if (user?.role === 'VOLUNTEER') {
      fetchTasks();
      // Check if volunteer has location setup saved
      const savedLocation = localStorage.getItem('volunteer_location');
      if (savedLocation) {
        const location = JSON.parse(savedLocation);
        setLocationSetup({ ...location, isSetup: true });
        if (location.latitude && location.longitude) {
          fetchAvailableTasks(location);
        }
      }
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await volunteerService.getMyTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTasks = async (location = locationSetup) => {
    try {
      const data = await volunteerService.getAvailableTasksNearby({
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        radiusInMeters: parseFloat(location.radius) * 1000
      });
      setAvailableTasks(data);
    } catch (error) {
      console.error('Error fetching available tasks:', error);
    }
  };

  const handleLocationSetup = (e) => {
    setLocationSetup({
      ...locationSetup,
      [e.target.name]: e.target.value
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationSetup({
            ...locationSetup,
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

  const saveLocationSettings = () => {
    const locationData = {
      latitude: locationSetup.latitude,
      longitude: locationSetup.longitude,
      radius: locationSetup.radius
    };
    localStorage.setItem('volunteer_location', JSON.stringify(locationData));
    setLocationSetup({ ...locationSetup, isSetup: true });
    fetchAvailableTasks(locationData);
  };

  const acceptTask = async (taskId) => {
    try {
      await volunteerService.acceptTask(taskId);
      fetchTasks(); // Refresh assigned tasks
      fetchAvailableTasks(); // Refresh available tasks
      alert('Task accepted successfully!');
    } catch (error) {
      console.error('Error accepting task:', error);
      alert('Failed to accept task. Please try again.');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await volunteerService.updateTaskStatus(taskId, newStatus);
      // Refresh the tasks list
      fetchTasks();
      alert('Task status updated successfully!');
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  const handlePickupNow = async (task) => {
    try {
      // For available tasks: accept then immediately set to IN_PROGRESS
      await volunteerService.acceptTask(task.id);
      await volunteerService.updateTaskStatus(task.id, 'IN_PROGRESS');
      fetchTasks();
      fetchAvailableTasks();
      alert('Pickup started. Task moved to In Progress.');
    } catch (error) {
      console.error('Error starting pickup:', error);
      alert('Failed to start pickup. Please try again.');
    }
  };

  // Check if user has access to this page
  if (user && user.role !== 'VOLUNTEER') {
    return (
      <div className="volunteer-tasks">
        <div className="container">
          <div className="access-denied">
            <div className="access-denied-icon">🚫</div>
            <h2>Access Denied</h2>
            <p>This page is only available to volunteers. Please contact an administrator if you believe this is an error.</p>
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
      <div className="volunteer-tasks">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner">Loading tasks...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="volunteer-tasks">
        <div className="container">
          <div className="error-container">
            <div className="error-message">{error}</div>
            <button onClick={fetchTasks} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="volunteer-tasks">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span className="page-icon">📋</span>
            My Volunteer Tasks
          </h1>
          <p className="page-description">
            Manage your volunteer assignments and delivery tasks
          </p>
        </div>

        {/* Location Setup Section */}
        {!locationSetup.isSetup && (
          <div className="location-setup-container">
            <div className="location-setup-card">
              <h2 className="setup-title">📍 Set Your Working Area</h2>
              <p className="setup-description">
                Set your location and preferred working radius to see available volunteer tasks in your area.
              </p>
              
              <div className="location-form">
                <div className="location-header">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="btn btn-secondary location-btn"
                  >
                    📍 Use My Current Location
                  </button>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Latitude</label>
                    <input
                      type="number"
                      name="latitude"
                      value={locationSetup.latitude}
                      onChange={handleLocationSetup}
                      className="form-control"
                      placeholder="e.g., 40.7128"
                      step="any"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Longitude</label>
                    <input
                      type="number"
                      name="longitude"
                      value={locationSetup.longitude}
                      onChange={handleLocationSetup}
                      className="form-control"
                      placeholder="e.g., -74.0060"
                      step="any"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Working Radius (km)</label>
                  <select
                    name="radius"
                    value={locationSetup.radius}
                    onChange={handleLocationSetup}
                    className="form-control"
                  >
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="15">15 km</option>
                    <option value="20">20 km</option>
                    <option value="30">30 km</option>
                    <option value="50">50 km</option>
                  </select>
                </div>
                
                <button
                  onClick={saveLocationSettings}
                  className="btn btn-primary save-location-btn"
                  disabled={!locationSetup.latitude || !locationSetup.longitude}
                >
                  Save Location Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        {locationSetup.isSetup && (
          <div className="tabs-container">
            <div className="tabs-nav">
              <button
                className={`tab-btn ${activeTab === 'assigned' ? 'active' : ''}`}
                onClick={() => setActiveTab('assigned')}
              >
                📋 My Assigned Tasks ({tasks.length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
                onClick={() => setActiveTab('available')}
              >
                🔍 Available Tasks ({availableTasks.length})
              </button>
            </div>
            
            <div className="location-info">
              <span className="location-text">
                📍 Working within {locationSetup.radius}km radius
              </span>
              <button
                onClick={() => setLocationSetup({ ...locationSetup, isSetup: false })}
                className="btn btn-secondary btn-sm"
              >
                Change Location
              </button>
            </div>
          </div>
        )}

        {/* Assigned Tasks Tab */}
        {locationSetup.isSetup && activeTab === 'assigned' && (
          <>
            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No tasks assigned</h3>
                <p>You don't have any assigned tasks at the moment. Check the "Available Tasks" tab to find tasks in your area.</p>
              </div>
            ) : (
              <div className="tasks-grid">
                {tasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <h3 className="task-title">Delivery Task #{task.id}</h3>
                      <span className={`status-badge ${task.status?.toLowerCase()}`}>
                        {task.status}
                      </span>
                    </div>
                    
                    <div className="task-details">
                      <div className="detail-item">
                        <span className="detail-icon">🍽️</span>
                        <span className="detail-text">Food: {task.donation?.title}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-icon">📦</span>
                        <span className="detail-text">Quantity: {task.donation?.quantity}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">Pickup Location</span>
                      </div>

                      {locationSetup.isSetup && (
                        <div className="detail-item">
                          <span className="detail-icon">📏</span>
                          <span className="detail-text">
                            {(() => {
                              const dist = getTaskDistanceKm(task);
                              return dist == null ? 'Distance: N/A' : `Distance: ${dist.toFixed(1)} km`;
                            })()}
                          </span>
                        </div>
                      )}
                      
                      <div className="detail-item">
                        <span className="detail-icon">⏰</span>
                        <span className="detail-text">
                          Assigned: {new Date(task.assignedDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {task.donation?.expiryDateTime && (
                        <div className="detail-item">
                          <span className="detail-icon">⚠️</span>
                          <span className="detail-text">
                            Expires: {new Date(task.donation.expiryDateTime).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      {task.donation?.description && (
                        <div className="detail-item">
                          <span className="detail-icon">📝</span>
                          <span className="detail-text">{task.donation.description}</span>
                        </div>
                      )}
                    </div>

                    <div className="task-actions">
                      {task.status === 'ASSIGNED' && (
                        <div className="action-buttons">
                          <button
                            onClick={() => handleUpdateStatus(task.id, 'IN_PROGRESS')}
                            className="btn btn-primary"
                            disabled={!isWithinWorkingRadius(task)}
                            title={isWithinWorkingRadius(task) ? 'Begin pickup' : 'Pickup available when within working radius'}
                          >
                            {isWithinWorkingRadius(task) ? 'Pickup' : 'Pickup (out of range)'}
                          </button>
                        </div>
                      )}
                      
                      {task.status === 'IN_PROGRESS' && (
                        <div className="action-buttons">
                          <button
                            onClick={() => handleUpdateStatus(task.id, 'COMPLETED')}
                            className="btn btn-success"
                          >
                            Mark Complete
                          </button>
                        </div>
                      )}
                      
                      {task.status === 'COMPLETED' && (
                        <div className="completed-info">
                          <span className="completed-text">✅ Task Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Available Tasks Tab */}
        {locationSetup.isSetup && activeTab === 'available' && (
          <>
            {availableTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No available tasks</h3>
                <p>There are no volunteer tasks available in your {locationSetup.radius}km radius at the moment. Try increasing your radius or check back later.</p>
              </div>
            ) : (
              <div className="tasks-grid">
                {availableTasks.map((task) => (
                  <div key={task.id} className="task-card available-task">
                    <div className="task-header">
                      <h3 className="task-title">Available Task #{task.id}</h3>
                      <span className="status-badge available">Available</span>
                    </div>
                    
                    <div className="task-details">
                      <div className="detail-item">
                        <span className="detail-icon">🍽️</span>
                        <span className="detail-text">Food: {task.donation?.title}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-icon">📦</span>
                        <span className="detail-text">Quantity: {task.donation?.quantity}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">Distance: {(() => {
                          const dist = getTaskDistanceKm(task);
                          return dist == null ? 'N/A' : `${dist.toFixed(1)} km`;
                        })()}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-icon">⏰</span>
                        <span className="detail-text">
                          Created: {new Date(task.donation?.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {task.donation?.expiryDateTime && (
                        <div className="detail-item">
                          <span className="detail-icon">⚠️</span>
                          <span className="detail-text">
                            Expires: {new Date(task.donation.expiryDateTime).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      {task.donation?.description && (
                        <div className="detail-item">
                          <span className="detail-icon">📝</span>
                          <span className="detail-text">{task.donation.description}</span>
                        </div>
                      )}
                    </div>

                    <div className="task-actions">
                      <div className="action-buttons">
                        <button
                          onClick={() => acceptTask(task.id)}
                          className="btn btn-success"
                        >
                          Accept Task
                        </button>
                        {isWithinWorkingRadius(task) && (
                          <button
                            onClick={() => handlePickupNow(task)}
                            className="btn btn-primary"
                            title="Accept and start pickup now"
                          >
                            Pickup Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VolunteerTasks;