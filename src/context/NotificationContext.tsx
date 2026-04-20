import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ref, onChildAdded, off, remove } from 'firebase/database';
import { rtdb } from '../firebase';
import { useAuth } from './AuthContext';

interface Notification {
  id?: string; // Realtime DB key
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}

interface NotificationContextType {
  notifications: Notification[];
  removeNotification: (id: string) => Promise<void>;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (user && user.id) {
      // 1. Firebase Realtime Database Listener (Primary for production)
      const notificationsRef = ref(rtdb, `system_notifications/${user.id}`);
      
      const unsubscribeRTDB = onChildAdded(notificationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const notification: Notification = {
            ...data,
            id: snapshot.key as string
          };

          setNotifications(prev => {
            const exists = prev.some(n => n.id === notification.id || (n.timestamp === notification.timestamp && n.message === notification.message));
            if (exists) return prev;
            return [notification, ...prev];
          });
          
          if (Notification.permission === 'granted') {
            new Notification('DSA Roadmap Update', { body: notification.message });
          }
        }
      });

      // 2. Socket.io Listener (Fallback for local development ONLY)
      const socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      let newSocket: Socket | null = null;

      if (isLocal) {
        newSocket = io(socketUrl, {
          withCredentials: true,
          transports: ['polling', 'websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000
        });

        newSocket.on('connect', () => {
          newSocket?.emit('join', user.id);
        });

        newSocket.on('notification', (notification: Notification) => {
          setNotifications(prev => {
            const exists = prev.some(n => n.timestamp === notification.timestamp && n.message === notification.message);
            if (exists) return prev;
            return [notification, ...prev];
          });
        });

        setSocket(newSocket);
      }

      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }

      return () => {
        off(notificationsRef, 'child_added', unsubscribeRTDB);
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  const removeNotification = async (id: string) => {
    if (user && user.id && id) {
      try {
        const notificationRef = ref(rtdb, `system_notifications/${user.id}/${id}`);
        await remove(notificationRef);
      } catch (err) {
        console.error('Failed to remove notification from RTDB:', err);
      }
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = async () => {
    if (user && user.id) {
      const notificationsRef = ref(rtdb, `system_notifications/${user.id}`);
      await remove(notificationsRef);
    }
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
