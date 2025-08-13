import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import chatService from '../../services/chatService';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import Loading from '../UI/Loading';
import './ChatSystem.css';

const ChatSystem = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Real-time chat connection
  useEffect(() => {
    if (isOpen && user) {
      // Connect to chat service
      chatService.connect(user.id, user.token);
      
      // Set up event listeners
      chatService.on('message', handleIncomingMessage);
      chatService.on('messageSent', handleMessageSent);
      chatService.on('connected', handleConnected);
      
      loadConversations();
      setOnlineUsers(chatService.getOnlineUsers());
      
      return () => {
        chatService.off('message', handleIncomingMessage);
        chatService.off('messageSent', handleMessageSent);
        chatService.off('connected', handleConnected);
      };
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [activeConversation, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Real-time event handlers
  const handleIncomingMessage = (message) => {
    // Update messages if it's for the active conversation
    if (activeConversation && message.conversationId === activeConversation.id) {
      setMessages(prev => [...prev, message]);
    }
    
    // Update conversation list
    setConversations(prev => prev.map(conv => 
      conv.id === message.conversationId 
        ? { 
            ...conv, 
            lastMessage: {
              content: message.content,
              timestamp: message.timestamp,
              senderId: message.senderId,
              isRead: false
            },
            unreadCount: conv.id === activeConversation?.id ? 0 : conv.unreadCount + 1
          }
        : conv
    ));
    
    showSuccess('New message received');
  };

  const handleMessageSent = (message) => {
    // Message was successfully sent
    console.log('Message sent:', message);
  };

  const handleConnected = (data) => {
    console.log('Connected to chat service:', data);
  };

  const loadConversations = async () => {
    setLoading(true);
    try {
      const conversations = await chatService.getConversations(user.id);
      setConversations(conversations);
    } catch (error) {
      showError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    setLoading(true);
    try {
      const messages = await chatService.getMessages(conversationId, user.id);
      setMessages(messages);
    } catch (error) {
      showError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    const messageContent = newMessage.trim();
    setNewMessage('');
    
    try {
      // Send message through chat service
      const sentMessage = chatService.sendMessage(
        activeConversation.id, 
        messageContent, 
        activeConversation.participant.id
      );
      
      // Add message to current conversation
      setMessages(prev => [...prev, sentMessage]);
      
      // Update conversation's last message
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation.id 
          ? { 
              ...conv, 
              lastMessage: { 
                content: messageContent,
                timestamp: sentMessage.timestamp,
                senderId: user.id,
                isRead: true
              } 
            }
          : conv
      ));
      
    } catch (error) {
      showError('Failed to send message');
      setNewMessage(messageContent); // Restore message on error
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
    loadMessages(conversation.id);
    
    // Mark as read
    if (conversation.unreadCount > 0) {
      setConversations(prev => prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      ));
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = (now - messageTime) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    
    const diffInHours = diffInMinutes / 60;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    
    const diffInDays = diffInHours / 24;
    if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`;
    
    return messageTime.toLocaleDateString();
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getInitials = (firstName, lastName, username) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  const filteredConversations = conversations.filter(conv => 
    conv.participant.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Messages" 
      size="large"
    >
      <div className="chat-container">
        {/* Conversations List */}
        <div className="conversations-panel">
          <div className="conversations-header">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
              }
            />
          </div>
          
          <div className="conversations-list">
            {loading && conversations.length === 0 ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3>No conversations found</h3>
                <p>Start a conversation by contacting other users</p>
              </div>
            ) : (
              filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${
                    activeConversation?.id === conversation.id ? 'active' : ''
                  }`}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="conversation-avatar-container">
                    <div className="conversation-avatar">
                      {getInitials(
                        conversation.participant.firstName,
                        conversation.participant.lastName,
                        conversation.participant.username
                      )}
                    </div>
                    {isUserOnline(conversation.participant.id) && (
                      <div className="online-indicator"></div>
                    )}
                  </div>
                  
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <span className="conversation-name">
                        {conversation.participant.firstName && conversation.participant.lastName
                          ? `${conversation.participant.firstName} ${conversation.participant.lastName}`
                          : conversation.participant.username
                        }
                      </span>
                      <span className="conversation-time">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    
                    <div className="conversation-preview">
                      <span className={`last-message ${!conversation.lastMessage.isRead ? 'unread' : ''}`}>
                        {conversation.lastMessage.content}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className="unread-badge">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    
                    <div className="participant-role">
                      {conversation.participant.role}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="chat-panel">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-participant">
                  <div className="participant-avatar-container">
                    <div className="participant-avatar">
                      {getInitials(
                        activeConversation.participant.firstName,
                        activeConversation.participant.lastName,
                        activeConversation.participant.username
                      )}
                    </div>
                    {isUserOnline(activeConversation.participant.id) && (
                      <div className="online-indicator"></div>
                    )}
                  </div>
                  <div className="participant-info">
                    <span className="participant-name">
                      {activeConversation.participant.firstName && activeConversation.participant.lastName
                        ? `${activeConversation.participant.firstName} ${activeConversation.participant.lastName}`
                        : activeConversation.participant.username
                      }
                    </span>
                    <span className="participant-status">
                      {isUserOnline(activeConversation.participant.id) ? 'Online' : 'Offline'} • {activeConversation.participant.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${
                      message.senderId === user.id ? 'message-sent' : 'message-received'
                    }`}
                  >
                    <div className="message-content">
                      {message.content}
                    </div>
                    <div className="message-time">
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                <div className="message-input-wrapper">
                  <textarea
                    ref={messageInputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="message-input"
                    rows={1}
                  />
                  <Button
                    variant="primary"
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="send-button"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                      </svg>
                    }
                  >
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="no-conversation-content">
                <div className="no-conversation-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ChatSystem;