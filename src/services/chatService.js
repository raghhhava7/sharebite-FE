import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Real-time Chat Service using WebSocket and STOMP
class ChatService {
  constructor() {
    this.stompClient = null;
    this.listeners = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.currentUser = null;
    this.token = null;
  }

  // Initialize WebSocket connection
  connect(username, token) {
    try {
      this.currentUser = username;
      this.token = token;

      // Create SockJS connection
      const socket = new SockJS(import.meta.env.VITE_API_BASE_URL_WS);
      
      // Create STOMP client
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // Set up connection callbacks
      this.stompClient.onConnect = (frame) => {
        console.log('Connected to WebSocket:', frame);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Subscribe to public chat
        this.subscribeToPublicChat();
        
        // Subscribe to private messages
        this.subscribeToPrivateMessages();
        
        // Notify listeners of connection
        this.emit('connected', { username });
        
        // Send join message
        this.joinPublicChat();
      };

      this.stompClient.onDisconnect = (frame) => {
        console.log('Disconnected from WebSocket:', frame);
        this.isConnected = false;
        this.emit('disconnected');
      };

      this.stompClient.onStompError = (frame) => {
        console.error('STOMP Error:', frame);
        this.emit('error', frame);
      };

      // Activate the connection
      this.stompClient.activate();
      
    } catch (error) {
      console.error('Failed to connect to chat service:', error);
      this.emit('error', error);
    }
  }

  // Subscribe to public chat
  subscribeToPublicChat() {
    if (this.stompClient && this.isConnected) {
      this.stompClient.subscribe('/topic/public', (message) => {
        const chatMessage = JSON.parse(message.body);
        console.log('Received public message:', chatMessage);
        this.emit('publicMessage', chatMessage);
      });
    }
  }

  // Subscribe to private messages
  subscribeToPrivateMessages() {
    if (this.stompClient && this.isConnected && this.currentUser) {
      this.stompClient.subscribe(`/user/${this.currentUser}/private`, (message) => {
        const chatMessage = JSON.parse(message.body);
        console.log('Received private message:', chatMessage);
        this.emit('privateMessage', chatMessage);
      });
    }
  }

  // Join public chat
  joinPublicChat() {
    if (this.stompClient && this.isConnected && this.currentUser) {
      const joinMessage = {
        sender: this.currentUser,
        type: 'JOIN'
      };
      
      this.stompClient.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify(joinMessage)
      });
    }
  }

  // Send public message
  sendPublicMessage(content) {
    if (!this.isConnected || !this.stompClient || !this.currentUser) {
      throw new Error('Not connected to chat service');
    }

    const message = {
      sender: this.currentUser,
      content: content,
      type: 'CHAT'
    };

    this.stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(message)
    });

    return message;
  }

  // Send private message
  sendPrivateMessage(recipient, content) {
    if (!this.isConnected || !this.stompClient || !this.currentUser) {
      throw new Error('Not connected to chat service');
    }

    const message = {
      sender: this.currentUser,
      recipient: recipient,
      content: content,
      type: 'CHAT'
    };

    this.stompClient.publish({
      destination: '/app/chat.sendPrivateMessage',
      body: JSON.stringify(message)
    });

    return message;
  }

  // Get message history from API
  async getPublicMessages(limit = 50) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat/messages/public?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching public messages:', error);
      return [];
    }
  }

  // Get private messages with a user
  async getPrivateMessages(username) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat/messages/private/${username}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching private messages:', error);
      return [];
    }
  }

  // Get available users for chat
  async getAvailableUsers() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat/users`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching available users:', error);
      return [];
    }
  }

  // Get conversations for user (mock for now, can be enhanced with real API)
  async getConversations(userId) {
    // In real implementation, fetch from API
    // For now, return mock data based on user
    return new Promise((resolve) => {
      setTimeout(() => {
        const conversations = this.getMockConversations(userId);
        resolve(conversations);
      }, 500);
    });
  }

  getMockConversations(userId) {
    const baseConversations = [
      {
        id: 1,
        participant: {
          id: 2,
          username: 'john_donor',
          role: 'DONOR',
          firstName: 'John',
          lastName: 'Smith',
          avatar: null,
          isOnline: true
        },
        lastMessage: {
          content: 'The fresh vegetables are ready for pickup',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          senderId: 2,
          isRead: false
        },
        unreadCount: 1
      },
      {
        id: 2,
        participant: {
          id: 3,
          username: 'sarah_volunteer',
          role: 'VOLUNTEER',
          firstName: 'Sarah',
          lastName: 'Johnson',
          avatar: null,
          isOnline: false
        },
        lastMessage: {
          content: 'I can help with the delivery tomorrow',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          senderId: 3,
          isRead: true
        },
        unreadCount: 0
      },
      {
        id: 3,
        participant: {
          id: 4,
          username: 'mike_receiver',
          role: 'RECEIVER',
          firstName: 'Mike',
          lastName: 'Wilson',
          avatar: null,
          isOnline: true
        },
        lastMessage: {
          content: 'Thank you for the donation!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
          senderId: 4,
          isRead: true
        },
        unreadCount: 0
      }
    ];

    // Filter conversations based on user role
    return baseConversations.filter(conv => conv.participant.id !== userId);
  }

  // Get messages for conversation
  async getMessages(conversationId, userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const messages = this.getMockMessages(conversationId, userId);
        resolve(messages);
      }, 300);
    });
  }

  getMockMessages(conversationId, userId) {
    const messageGroups = {
      1: [
        {
          id: 1,
          content: 'Hi! I have fresh vegetables available for donation.',
          senderId: 2,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
          senderName: 'John Smith',
          type: 'text'
        },
        {
          id: 2,
          content: 'That sounds great! What vegetables do you have?',
          senderId: userId,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
          senderName: 'You',
          type: 'text'
        },
        {
          id: 3,
          content: 'I have carrots, broccoli, spinach, and lettuce. About 5kg total.',
          senderId: 2,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          senderName: 'John Smith',
          type: 'text'
        },
        {
          id: 4,
          content: 'Perfect! When can I pick them up?',
          senderId: userId,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
          senderName: 'You',
          type: 'text'
        },
        {
          id: 5,
          content: 'The fresh vegetables are ready for pickup',
          senderId: 2,
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          senderName: 'John Smith',
          type: 'text'
        }
      ],
      2: [
        {
          id: 6,
          content: 'Hi! I saw you need help with delivery.',
          senderId: 3,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
          senderName: 'Sarah Johnson',
          type: 'text'
        },
        {
          id: 7,
          content: 'Yes! That would be amazing. Thank you!',
          senderId: userId,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
          senderName: 'You',
          type: 'text'
        },
        {
          id: 8,
          content: 'I can help with the delivery tomorrow',
          senderId: 3,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          senderName: 'Sarah Johnson',
          type: 'text'
        }
      ],
      3: [
        {
          id: 9,
          content: 'Hello! I received your donation today.',
          senderId: 4,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
          senderName: 'Mike Wilson',
          type: 'text'
        },
        {
          id: 10,
          content: 'I hope it helps! How was the quality?',
          senderId: userId,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5.5),
          senderName: 'You',
          type: 'text'
        },
        {
          id: 11,
          content: 'Thank you for the donation!',
          senderId: 4,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
          senderName: 'Mike Wilson',
          type: 'text'
        }
      ]
    };

    return messageGroups[conversationId] || [];
  }

  // Event listener management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Disconnect
  disconnect() {
    this.isConnected = false;
    this.listeners.clear();
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.currentUser = null;
    this.token = null;
  }

  // Get online users
  getOnlineUsers() {
    // In real implementation, get from server
    return new Set([2, 4]); // Mock online users
  }
}

// Export singleton instance
export default new ChatService();