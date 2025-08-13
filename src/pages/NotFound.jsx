import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-icon">🍽️</div>
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-description">
            Oops! The page you're looking for seems to have gone missing. 
            Don't worry, there's still plenty of good food to share!
          </p>
          
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              Dashboard
            </Link>
          </div>
          
          <div className="not-found-suggestions">
            <h3>You might be looking for:</h3>
            <ul className="suggestions-list">
              <li><Link to="/donations">Available Donations</Link></li>
              <li><Link to="/donations/create">Create Donation</Link></li>
              <li><Link to="/volunteer/tasks">Volunteer Tasks</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;