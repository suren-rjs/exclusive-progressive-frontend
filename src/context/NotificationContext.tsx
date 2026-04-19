import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface Notification {
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}

interface NotificationContextType {
  notifications: Notification[];
  removeNotification: (index: number) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user && user.id) {
      // Connect to Socket.io server
      const socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      const newSocket = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5
      });

      newSocket.on('connect', () => {
        newSocket.emit('join', user.id);
      });

      newSocket.on('notification', (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        
        // Browser native notification (optional)
        if (Notification.permission === 'granted') {
          new Notification('DSA Roadmap Update', {
            body: notification.message
          });
        }
      });

      setSocket(newSocket);

      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  const removeNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, removeNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
