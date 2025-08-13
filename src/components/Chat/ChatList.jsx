import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import chatService from '../../services/chatService';
import './ChatList.css';

const ChatList = ({ onViewChange }) => {
  const { user } = useAuth();
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadAvailableUsers();
    }
  }, [user]);

  const loadAvailableUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const users = await chatService.getAvailableUsers();
      setAvailableUsers(users);
    } catch (error) {
      console.error('Error loading available users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'DONOR': return '🍽️';
      case 'RECEIVER': return '🤝';
      case 'VOLUNTEER': return '🚚';
      case 'ADMIN': return '👑';
      default: return '👤';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'DONOR': return '#28a745';
      case 'RECEIVER': return '#17a2b8';
      case 'VOLUNTEER': return '#ffc107';
      case 'ADMIN': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="chat-list">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list">
      {/* Public Chat Option */}
      <div 
        className="chat-option public-chat"
        onClick={() => onViewChange('public')}
      >
        <div className="chat-avatar public">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div className="chat-info">
          <div className="chat-name">Public Chat</div>
          <div className="chat-description">Chat with all ShareBite users</div>
        </div>
        <div className="chat-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </div>
      </div>

      {/* Private Chat Users */}
      <div className="chat-section">
        <div className="section-header">
          <h3 className="section-title">Private Chats</h3>
          <button 
            className="refresh-btn"
            onClick={loadAvailableUsers}
            disabled={loading}
            title="Refresh user list"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6"></path>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={loadAvailableUsers} className="retry-btn">
              Try Again
            </button>
          </div>
        )}
        
        {!error && availableUsers.length === 0 ? (
          <div className="empty-state">
            <p>No other users available for chat</p>
            <button onClick={loadAvailableUsers} className="retry-btn">
              Refresh
            </button>
          </div>
        ) : !error && (
          <div className="users-list">
            {availableUsers.map((chatUser) => (
              <div 
                key={chatUser.username}
                className="chat-option user-chat"
                onClick={() => onViewChange('private', chatUser.username)}
              >
                <div className="chat-avatar user" style={{ backgroundColor: getRoleColor(chatUser.role) }}>
                  <span className="role-icon">{getRoleIcon(chatUser.role)}</span>
                  {chatUser.isOnline && <div className="online-indicator"></div>}
                </div>
                <div className="chat-info">
                  <div className="chat-name">
                    {chatUser.firstName} {chatUser.lastName}
                    <span className="username">@{chatUser.username}</span>
                  </div>
                  <div className="chat-description">
                    <span className="role-badge" style={{ backgroundColor: getRoleColor(chatUser.role) }}>
                      {chatUser.role}
                    </span>
                    {chatUser.isOnline ? (
                      <span className="status online">Online</span>
                    ) : (
                      <span className="status offline">Offline</span>
                    )}
                  </div>
                </div>
                <div className="chat-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;