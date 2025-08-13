import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import chatService from '../../services/chatService';
import ChatRoom from './ChatRoom';
import PrivateChat from './PrivateChat';
import ChatList from './ChatList';
import './ChatWidget.css';

const ChatWidget = () => {
  const { user, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState('list'); // 'list', 'public', 'private'
  const [activeChat, setActiveChat] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user && token) {
      // Connect to chat service
      chatService.connect(user.username, token);

      // Set up event listeners
      chatService.on('connected', () => {
        setIsConnected(true);
      });

      chatService.on('disconnected', () => {
        setIsConnected(false);
      });

      chatService.on('publicMessage', (message) => {
        if (!isOpen || activeView !== 'public') {
          setUnreadCount(prev => prev + 1);
        }
      });

      chatService.on('privateMessage', (message) => {
        if (!isOpen || activeView !== 'private' || activeChat !== message.sender) {
          setUnreadCount(prev => prev + 1);
        }
      });

      // Cleanup on unmount
      return () => {
        chatService.disconnect();
      };
    }
  }, [user, token, isOpen, activeView, activeChat]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Clear unread count when opening
    }
  };

  const handleViewChange = (view, chatUser = null) => {
    setActiveView(view);
    setActiveChat(chatUser);
    setUnreadCount(0); // Clear unread count when switching views
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveView('list');
    setActiveChat(null);
  };

  if (!user) {
    return null; // Don't show chat for unauthenticated users
  }

  return (
    <div className="chat-widget">
      {/* Chat Toggle Button */}
      <button 
        className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={handleToggleChat}
        title="Open Chat"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
        <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-title">
              {activeView === 'list' && 'ShareBite Chat'}
              {activeView === 'public' && 'Public Chat'}
              {activeView === 'private' && `Chat with ${activeChat}`}
            </div>
            <div className="chat-controls">
              {activeView !== 'list' && (
                <button 
                  className="back-btn"
                  onClick={() => handleViewChange('list')}
                  title="Back to chat list"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                </button>
              )}
              <button 
                className="close-btn"
                onClick={handleClose}
                title="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <div className="chat-content">
            {activeView === 'list' && (
              <ChatList onViewChange={handleViewChange} />
            )}
            {activeView === 'public' && (
              <ChatRoom />
            )}
            {activeView === 'private' && activeChat && (
              <PrivateChat recipient={activeChat} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;