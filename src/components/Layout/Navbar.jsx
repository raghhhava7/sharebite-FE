import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserProfile from '../Profile/UserProfile';
import Button from '../UI/Button';
import logo from '../../assets/sharebite logo.png';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Standard Navigation */}
      <nav className="standard-navbar">
        <div className="nav-container">
          {/* Brand */}
          <Link to="/" className="nav-brand">
            <div className="brand-logo">
              <img src={logo} alt="ShareBite" className="logo-image" />
            </div>
            <span className="brand-text">ShareBite</span>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated() && (
            <div className="nav-links">
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Dashboard
              </Link>
              
              {user?.role === 'DONOR' && (
                <Link 
                  to="/create-donation" 
                  className={`nav-link ${location.pathname === '/create-donation' ? 'active' : ''}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Create
                </Link>
              )}
              
              {user?.role === 'RECEIVER' && (
                <Link 
                  to="/donations" 
                  className={`nav-link ${location.pathname === '/donations' ? 'active' : ''}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                  Browse
                </Link>
              )}
              
              {user?.role === 'VOLUNTEER' && (
                <Link 
                  to="/volunteer-tasks" 
                  className={`nav-link ${location.pathname === '/volunteer-tasks' ? 'active' : ''}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                  Tasks
                </Link>
              )}
            </div>
          )}

          {/* User Actions */}
          <div className="nav-actions">
            {isAuthenticated() ? (
              <>
                <button 
                  className="action-btn profile-btn"
                  onClick={() => setShowProfile(true)}
                  title="Profile"
                >
                  <div className="user-avatar">
                    {user?.firstName ? user.firstName.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>
                
                <button 
                  className="action-btn logout-btn"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16,17 21,12 16,7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-link login-link">
                  Login
                </Link>
                <Link to="/signup" className="auth-link signup-link">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      <UserProfile 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
    </>
  );
};

export default Navbar;