import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = 'Loading...', 
  fullScreen = false,
  className = '' 
}) => {
  const spinnerClasses = [
    'loading-spinner',
    `loading-spinner--${size}`,
    `loading-spinner--${color}`,
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'loading-container',
    fullScreen && 'loading-container--fullscreen'
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className={spinnerClasses} aria-hidden="true">
        <div className="loading-spinner__circle"></div>
        <div className="loading-spinner__circle"></div>
        <div className="loading-spinner__circle"></div>
      </div>
      <span className="loading-text" aria-label={text}>
        {text}
      </span>
    </div>
  );
};

export default LoadingSpinner;