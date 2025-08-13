import React from 'react';
import './Loading.css';
import logo from '../../assets/sharebite logo.png';

const Loading = ({ message = 'Loading...', size = 'medium' }) => {
  return (
    <div className="loading-overlay">
      <div className={`loading-content loading-${size}`}>
        <div className="loading-logo-container">
          <div className="loading-spinner-ring"></div>
          <img 
            src={logo} 
            alt="ShareBite" 
            className="loading-logo"
          />
        </div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

export default Loading;