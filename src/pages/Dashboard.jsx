import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDonorDashboard = () => (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2>Welcome back, {user?.username}!</h2>
        <p>Manage your food donations and make a difference in your community.</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">➕</div>
          <h3>Create New Donation</h3>
          <p>Add a new food donation to help those in need</p>
          <Link to="/donations/create" className="btn btn-primary">
            Create Donation
          </Link>
        </div>
        
        <div className="dashboard-card">
          <div className="card-icon">📋</div>
          <h3>My Donations</h3>
          <p>View and manage your existing donations</p>
          <Link to="/donations/my-donations" className="btn btn-secondary">
            View Donations
          </Link>
        </div>
        
        <div className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>Impact Summary</h3>
          <p>See the impact of your contributions</p>
          <div className="stats-mini">
            <div className="stat-mini">
              <span className="stat-number">12</span>
              <span className="stat-label">Total Donations</span>
            </div>
            <div className="stat-mini">
              <span className="stat-number">48</span>
              <span className="stat-label">Meals Provided</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReceiverDashboard = () => (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2>Welcome back, {user?.username}!</h2>
        <p>Find and reserve food donations in your area.</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">🔍</div>
          <h3>Available Donations</h3>
          <p>Browse all available food donations</p>
          <Link to="/donations" className="btn btn-primary">
            Browse Donations
          </Link>
        </div>
        
        <div className="dashboard-card">
          <div className="card-icon">📍</div>
          <h3>Find Nearby</h3>
          <p>Search for donations near your location</p>
          <Link to="/donations/nearby" className="btn btn-secondary">
            Find Nearby
          </Link>
        </div>
        
        <div className="dashboard-card">
          <div className="card-icon">📋</div>
          <h3>My Reservations</h3>
          <p>View your reserved donations</p>
          <div className="stats-mini">
            <div className="stat-mini">
              <span className="stat-number">3</span>
              <span className="stat-label">Active Reservations</span>
            </div>
            <div className="stat-mini">
              <span className="stat-number">15</span>
              <span className="stat-label">Total Received</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVolunteerDashboard = () => (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2>Welcome back, {user?.username}!</h2>
        <p>Help deliver food donations to those who need them most.</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">📋</div>
          <h3>My Tasks</h3>
          <p>View and manage your volunteer assignments</p>
          <Link to="/volunteer/tasks" className="btn btn-primary">
            View Tasks
          </Link>
        </div>
        
        <div className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>Volunteer Impact</h3>
          <p>See the difference you're making</p>
          <div className="stats-mini">
            <div className="stat-mini">
              <span className="stat-number">8</span>
              <span className="stat-label">Completed Tasks</span>
            </div>
            <div className="stat-mini">
              <span className="stat-number">32</span>
              <span className="stat-label">Meals Delivered</span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-icon">⭐</div>
          <h3>Recognition</h3>
          <p>Your volunteer achievements</p>
          <div className="achievement-badges">
            <span className="badge">🏆 Top Volunteer</span>
            <span className="badge">🚚 Delivery Expert</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2>Admin Dashboard</h2>
        <p>Manage users, monitor activities, and oversee the platform.</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">👥</div>
          <h3>User Management</h3>
          <p>Manage all platform users</p>
          <Link to="/admin/users" className="btn btn-primary">
            Manage Users
          </Link>
        </div>
        
        <div className="dashboard-card">
          <div className="card-icon">📋</div>
          <h3>All Tasks</h3>
          <p>Monitor volunteer tasks and assignments</p>
          <Link to="/admin/tasks" className="btn btn-secondary">
            View All Tasks
          </Link>
        </div>
        
        <div className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>Platform Statistics</h3>
          <p>Overall platform metrics</p>
          <div className="stats-mini">
            <div className="stat-mini">
              <span className="stat-number">500</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-mini">
              <span className="stat-number">1,200</span>
              <span className="stat-label">Total Donations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'DONOR':
        return renderDonorDashboard();
      case 'RECEIVER':
        return renderReceiverDashboard();
      case 'VOLUNTEER':
        return renderVolunteerDashboard();
      case 'ADMIN':
        return renderAdminDashboard();
      default:
        return (
          <div className="dashboard-content">
            <div className="welcome-section">
              <h2>Welcome to ShareBite</h2>
              <p>Your role is not recognized. Please contact support.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default Dashboard;