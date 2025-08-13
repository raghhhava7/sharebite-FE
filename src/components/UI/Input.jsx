import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  icon,
  className = '',
  required = false,
  ...props 
}, ref) => {
  const inputClasses = [
    'input-field',
    error ? 'input-error' : '',
    icon ? 'input-with-icon' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {icon && <div className="input-icon">{icon}</div>}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && <div className="input-error-text">{error}</div>}
      {helperText && !error && <div className="input-helper-text">{helperText}</div>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;