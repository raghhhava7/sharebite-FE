import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import Card from '../UI/Card';
import Button from '../UI/Button';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { showInfo } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeDonations: 0,
    completedDonations: 0,
    totalRecipients: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.role) return;
    
    setLoading(true);
    try {
      // Load real statistics based on user role
      const statsData = await dashboardService.getStats(user.role);
      const activityData = await dashboardService.getRecentActivity(user.role, user.username);
      
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Keep default stats on error
    } finally {
      setLoading(false);
    }
  };

  const getRoleSpecificActions = () => {
    switch (user?.role) {
      case 'DONOR':
        return [
          {
            title: 'Create Donation',
            description: 'Post a new food donation',
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            ),
            action: () => navigate('/create-donation'),
            variant: 'primary'
          },
          {
            title: 'My Donations',
            description: 'View and manage your donations',
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            ),
            action: () => navigate('/my-donations'),
            variant: 'outline'
          }
        ];
      case 'RECEIVER':
        return [
          {
            title: 'Browse Donations',
            description: 'Find available food donations',
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
            ),
            action: () => navigate('/donations'),
            variant: 'primary'
          },
          {
            title: 'My Reservations',
            description: 'View your reserved donations',
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
            ),
            action: () => navigate('/my-reservations'),
            variant: 'outline'
          }
        ];
      case 'VOLUNTEER':
        return [
          {
            title: 'My Tasks',
            description: 'View your volunteer assignments',
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            ),
            action: () => navigate('/volunteer-tasks'),
            variant: 'primary'
          },
          {
            title: 'Find Tasks',
            description: 'Find available volunteer tasks',
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            ),
            action: () => navigate('/volunteer-tasks'),
            variant: 'outline'
          }
        ];
      case 'ADMIN':
        return [
          {
            title: 'Manage Users',
            description: 'View and manage all users',
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            ),
            action: () => navigate('/admin/users'),
            variant: 'primary'
          },
          {
            title: 'System Overview',
            description: 'View system statistics',
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            ),
            action: () => navigate('/admin/dashboard'),
            variant: 'outline'
          }
        ];
      default:
        return [];
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const roleActions = getRoleSpecificActions();

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">
              {getGreeting()}, {user?.firstName || user?.username}!
            </h1>
            <p className="dashboard-subtitle">
              Welcome to your ShareBite dashboard
            </p>
          </div>
          
          <div className="header-actions">
            <Button 
              variant="outline" 
              onClick={loadDashboardData}
              disabled={loading}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6"></path>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
              }
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/profile')}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              }
            >
              Profile
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalDonations}</h3>
              <p className="stat-label">
                {user?.role === 'DONOR' && 'My Donations'}
                {user?.role === 'RECEIVER' && 'Available Donations'}
                {user?.role === 'VOLUNTEER' && 'Total Tasks'}
                {user?.role === 'ADMIN' && 'Total Donations'}
              </p>
            </div>
          </Card>
          
          <Card className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6"></path>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.activeDonations}</h3>
              <p className="stat-label">
                {user?.role === 'DONOR' && 'Active Donations'}
                {user?.role === 'RECEIVER' && 'My Reservations'}
                {user?.role === 'VOLUNTEER' && 'Active Tasks'}
                {user?.role === 'ADMIN' && 'Active Donations'}
              </p>
            </div>
          </Card>
          
          <Card className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.completedDonations}</h3>
              <p className="stat-label">
                {user?.role === 'DONOR' && 'Completed'}
                {user?.role === 'RECEIVER' && 'Received'}
                {user?.role === 'VOLUNTEER' && 'Completed'}
                {user?.role === 'ADMIN' && 'Completed'}
              </p>
            </div>
          </Card>
          
          <Card className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalRecipients}</h3>
              <p className="stat-label">
                {user?.role === 'DONOR' && 'People Helped'}
                {user?.role === 'RECEIVER' && 'Total Received'}
                {user?.role === 'VOLUNTEER' && 'Deliveries Made'}
                {user?.role === 'ADMIN' && 'Total Users'}
              </p>
            </div>
          </Card>
        </div>

        <div className="dashboard-content">
          {/* Quick Actions */}
          <div className="dashboard-section">
            <Card className="actions-card">
              <div className="card-header">
                <h2 className="section-title">Quick Actions</h2>
                <p className="section-subtitle">
                  Common tasks for {user?.role?.toLowerCase()}s
                </p>
              </div>
              
              <div className="actions-grid">
                {roleActions.map((action, index) => (
                  <div key={index} className="action-item">
                    <div className="action-icon">{action.icon}</div>
                    <div className="action-content">
                      <h3 className="action-title">{action.title}</h3>
                      <p className="action-description">{action.description}</p>
                      <Button 
                        variant={action.variant}
                        size="small"
                        onClick={action.action}
                        className="action-button"
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-section">
            <Card className="activity-card">
              <div className="card-header">
                <h2 className="section-title">Recent Activity</h2>
                <p className="section-subtitle">
                  Your latest updates and notifications
                </p>
              </div>
              
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading recent activity...</p>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <h3>No recent activity</h3>
                  <p>Your recent activity will appear here</p>
                </div>
              ) : (
                <div className="activity-list">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">{activity.icon}</div>
                      <div className="activity-content">
                        <h4 className="activity-title">{activity.title}</h4>
                        <p className="activity-description">{activity.description}</p>
                        <span className="activity-time">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Role-specific Information */}
        <div className="dashboard-section">
          <Card className="info-card">
            <div className="card-header">
              <h2 className="section-title">
                {user?.role === 'DONOR' && 'Donation Tips'}
                {user?.role === 'RECEIVER' && 'Getting Help'}
                {user?.role === 'VOLUNTEER' && 'Volunteer Guidelines'}
                {user?.role === 'ADMIN' && 'System Overview'}
              </h2>
            </div>
            
            <div className="info-content">
              {user?.role === 'DONOR' && (
                <div className="tips-list">
                  <div className="tip-item">
                    <span className="tip-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                      </svg>
                    </span>
                    <p>Ensure food is fresh and safe for consumption</p>
                  </div>
                  <div className="tip-item">
                    <span className="tip-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                    </span>
                    <p>Package food properly for transport</p>
                  </div>
                  <div className="tip-item">
                    <span className="tip-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                    </span>
                    <p>Specify pickup times clearly</p>
                  </div>
                </div>
              )}
              
              {user?.role === 'RECEIVER' && (
                <div className="tips-list">
                  <div className="tip-item">
                    <span className="tip-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                      </svg>
                    </span>
                    <p>Browse available donations regularly</p>
                  </div>
                  <div className="tip-item">
                    <span className="tip-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </span>
                    <p>Communicate clearly with donors</p>
                  </div>
                  <div className="tip-item">
                    <span className="tip-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </span>
                    <p>Show appreciation to donors</p>
                  </div>
                </div>
              )}
              
              {user?.role === 'VOLUNTEER' && (
                <div className="tips-list">
                  <div className="tip-item">
                    <span className="tip-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                      </svg>
                    </span>
                    <p>Confirm delivery details before pickup</p>
                  </div>
                  <div className="tip-item">
                    <span className="tip-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    </span>
                    <p>Keep donors and receivers updated</p>
                  </div>
                  <div className="tip-item">
                    <span className="tip-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2.5 2v6h6M21.5 22v-6h-6"></path>
                        <path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2"></path>
                      </svg>
                    </span>
                    <p>Handle perishable items with care</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;