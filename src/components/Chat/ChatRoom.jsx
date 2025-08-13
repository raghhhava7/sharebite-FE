import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import chatService from '../../services/chatService';
import './ChatRoom.css';

const ChatRoom = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load message history
    loadMessageHistory();

    // Set up real-time message listener
    chatService.on('publicMessage', handleNewMessage);

    return () => {
      chatService.off('publicMessage', handleNewMessage);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);

  const loadMessageHistory = async () => {
    try {
      setLoading(true);
      const history = await chatService.getPublicMessages(50);
      // Reverse to show oldest first
      setMessages(history.reverse());
    } catch (error) {
      console.error('Error loading message history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      await chatService.sendPublicMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getMessageTypeClass = (type) => {
    switch (type) {
      case 'JOIN': return 'system-message join';
      case 'LEAVE': return 'system-message leave';
      default: return 'chat-message';
    }
  };

  const isOwnMessage = (sender) => {
    return sender === user?.username;
  };

  if (loading) {
    return (
      <div className="chat-room">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-room">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-messages">
            <div className="empty-icon">💬</div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => {
              const showDate = index === 0 || 
                formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
              
              return (
                <div key={message.id || index}>
                  {showDate && (
                    <div className="date-separator">
                      <span>{formatDate(message.timestamp)}</span>
                    </div>
                  )}
                  
                  <div className={`message ${getMessageTypeClass(message.type)} ${isOwnMessage(message.sender) ? 'own' : 'other'}`}>
                    {message.type === 'CHAT' ? (
                      <>
                        {!isOwnMessage(message.sender) && (
                          <div className="message-sender">{message.sender}</div>
                        )}
                        <div className="message-content">
                          <span className="message-text">{message.content}</span>
                          <span className="message-time">{formatTime(message.timestamp)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="system-content">
                        <span className="system-text">{message.content}</span>
                        <span className="system-time">{formatTime(message.timestamp)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
            disabled={sending}
            maxLength={1000}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <div className="sending-spinner"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;