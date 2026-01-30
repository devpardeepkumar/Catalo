import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useNotifications } from '../../context/NotificationsContext';
import { styles } from '../../styles/components/notifications/NotificationList';
import { Notification, NotificationType } from '../../types/notification';
import { NotificationCard } from './NotificationCard';

interface NotificationListProps {
  notifications: Notification[];
  activeFilter: NotificationType;
  isSelectionMode?: boolean;
  selectedNotifications?: Set<string>;
  onToggleSelection?: (notificationId: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  activeFilter,
  isSelectionMode = false,
  selectedNotifications = new Set(),
  onToggleSelection,
}) => {
  const { markAsRead, removeNotification } = useNotifications();
  const router = useRouter();

  const filteredNotifications = notifications.filter(notification =>
    activeFilter === 'all' || notification.category === activeFilter
  );

  const handleCardPress = (notification: Notification) => {
    if (isSelectionMode) {
      // In selection mode, toggle selection instead of navigating
      onToggleSelection?.(notification.id);
    } else {
      // Mark as read when user taps on notification
      markAsRead(notification.id);

      // Navigate to notification detail screen with notification data
      router.push({
        pathname: '/notification-detail',
        params: {
          notificationId: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          timestamp: notification.timestamp.toISOString(),
          category: notification.category,
        },
      });
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    // Remove the notification from the list
    removeNotification(notificationId);
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <View>
      <NotificationCard
        notification={item}
        onPress={() => handleCardPress(item)}
        onDelete={() => handleDeleteNotification(item.id)}
        isSelectionMode={isSelectionMode}
        isSelected={selectedNotifications.has(item.id)}
        onToggleSelection={() => onToggleSelection?.(item.id)}
      />
      <View style={styles.divider} />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No notifications found</Text>
      <Text style={styles.emptySubtext}>
        {activeFilter === 'all'
          ? 'You\'re all caught up!'
          : `No ${activeFilter} notifications at the moment.`}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={filteredNotifications}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};
