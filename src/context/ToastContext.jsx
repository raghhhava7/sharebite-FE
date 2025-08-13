import React, { createContext, useContext, useState, useEffect } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', description = null, duration = 4000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, description, duration };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, description, duration) => addToast(message, 'success', description, duration);
  const showError = (message, description, duration) => addToast(message, 'error', description, duration);
  const showWarning = (message, description, duration) => addToast(message, 'warning', description, duration);
  const showInfo = (message, description, duration) => addToast(message, 'info', description, duration);

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
    </ToastContext.Provider>
  );
};