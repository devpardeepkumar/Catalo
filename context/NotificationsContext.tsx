import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Notification } from '../types/notification';
import notificationsApi from '../services/api/notificationsApi';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id'>) => Promise<void>;
  removeNotification: (notificationId: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  deleteReadNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
console.log('check notifications', notifications);
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationsApi.getNotifications();
      console.log('Notification API data:', data); 
      setNotifications(Array.isArray(data.notifications) ? data.notifications.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })) : []);
      //setNotifications(Array.isArray(data.data) ? data.data : []); // Access data.data
      setHasFetched(true);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchNotifications();
    }
  }, [hasFetched]);

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      fetchNotifications(); // Re-fetch to update state
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      fetchNotifications(); // Re-fetch to update state
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const addNotification = async (newNotification: Omit<Notification, 'id'>) => {
    // Assuming the API has an endpoint to add notifications, otherwise this would be client-side only
    // For now, client-side only for this mock function.
    const notification: Notification = {
      ...newNotification,
      id: Date.now().toString(), // Simple ID generation for mock
      isRead: false,
      timestamp: new Date(),
      category: 'alerts', // Default category for new notifications
    };
    setNotifications(prev => [notification, ...prev]);
    // Optionally, if an API for adding exists, you would call it here and then fetchNotifications()
  };

  const removeNotification = async (notificationId: string) => {
    try {
      await notificationsApi.deleteNotification(notificationId);
      fetchNotifications(); // Re-fetch to update state
    } catch (error) {
      console.error('Failed to remove notification:', error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      // This might require a specific API endpoint for deleting all, or iterating and deleting one by one.
      // For now, let's iterate and delete one by one.
      await Promise.all(notifications.map(n => notificationsApi.deleteNotification(n.id)));
      fetchNotifications(); // Re-fetch to update state
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
    }
  };

  const deleteReadNotifications = async () => {
    try {
      const readNotificationIds = notifications.filter(n => n.isRead).map(n => n.id);
      await Promise.all(readNotificationIds.map(id => notificationsApi.deleteNotification(id)));
      fetchNotifications(); // Re-fetch to update state
    } catch (error) {
      console.error('Failed to delete read notifications:', error);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        addNotification,
        removeNotification,
        deleteAllNotifications,
        deleteReadNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};