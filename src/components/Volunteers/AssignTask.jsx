import React, { useState, useEffect } from 'react';
import { volunteerService } from '../../services/volunteerService';
import { donationService } from '../../services/donationService';
import './AssignTask.css';

const AssignTask = () => {
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch available donations and volunteers
      const [donationsData] = await Promise.all([
        donationService.getAvailableDonations()
      ]);
      
      setDonations(donationsData.filter(d => d.status === 'RESERVED'));
      // Note: In a real app, you'd have an endpoint to get available volunteers
      // For now, we'll use a placeholder
      setVolunteers([
        { id: 1, username: 'volunteer1', email: 'vol1@example.com' },
        { id: 2, username: 'volunteer2', email: 'vol2@example.com' }
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    
    if (!selectedDonation || !selectedVolunteer) {
      setError('Please select both a donation and a volunteer.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await volunteerService.assignTask(selectedDonation, selectedVolunteer);
      
      setSuccess('Task assigned successfully!');
      setSelectedDonation('');
      setSelectedVolunteer('');
      
      // Refresh the donations list
      fetchData();
    } catch (error) {
      console.error('Error assigning task:', error);
      setError('Failed to assign task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assign-task">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span className="page-icon">👥</span>
            Assign Volunteer Task
          </h1>
          <p className="page-description">
            Assign volunteers to help with donation deliveries
          </p>
        </div>

        <div className="form-container">
          <form onSubmit={handleAssignTask} className="assign-form">
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="donation" className="form-label">
                Select Donation *
              </label>
              <select
                id="donation"
                value={selectedDonation}
                onChange={(e) => setSelectedDonation(e.target.value)}
                className="form-control"
                required
                disabled={loading}
              >
                <option value="">Choose a donation...</option>
                {donations.map((donation) => (
                  <option key={donation.id} value={donation.id}>
                    {donation.foodType} - {donation.quantity} ({donation.location})
                  </option>
                ))}
              </select>
              {donations.length === 0 && (
                <div className="form-help">
                  No reserved donations available for assignment.
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="volunteer" className="form-label">
                Select Volunteer *
              </label>
              <select
                id="volunteer"
                value={selectedVolunteer}
                onChange={(e) => setSelectedVolunteer(e.target.value)}
                className="form-control"
                required
                disabled={loading}
              >
                <option value="">Choose a volunteer...</option>
                {volunteers.map((volunteer) => (
                  <option key={volunteer.id} value={volunteer.id}>
                    {volunteer.username} ({volunteer.email})
                  </option>
                ))}
              </select>
            </div>

            {selectedDonation && (
              <div className="donation-preview">
                <h3>Selected Donation Details</h3>
                {donations
                  .filter(d => d.id.toString() === selectedDonation)
                  .map(donation => (
                    <div key={donation.id} className="preview-card">
                      <div className="preview-item">
                        <span className="preview-label">Food Type:</span>
                        <span className="preview-value">{donation.foodType}</span>
                      </div>
                      <div className="preview-item">
                        <span className="preview-label">Quantity:</span>
                        <span className="preview-value">{donation.quantity}</span>
                      </div>
                      <div className="preview-item">
                        <span className="preview-label">Location:</span>
                        <span className="preview-value">{donation.location}</span>
                      </div>
                      <div className="preview-item">
                        <span className="preview-label">Expires:</span>
                        <span className="preview-value">
                          {new Date(donation.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                      {donation.description && (
                        <div className="preview-item">
                          <span className="preview-label">Description:</span>
                          <span className="preview-value">{donation.description}</span>
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !selectedDonation || !selectedVolunteer}
              >
                {loading ? 'Assigning...' : 'Assign Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;