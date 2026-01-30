import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { NotificationCard } from '../../components/notifications/NotificationCard';
import { NotificationFilters } from '../../components/notifications/NotificationFilters';
import { useNotifications } from '../../context/NotificationsContext';
import { styles } from '../../styles/tabs/notifications';
import { NotificationType } from '../../types/notification';

export default function NotificationsScreen() {
  const [activeFilter, setActiveFilter] = useState<NotificationType>('all');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const { notifications, markAsRead, markAllAsRead, unreadCount, removeNotification, addNotification } = useNotifications();
  const router = useRouter();
console.log('notifications', notifications);
  const getNotificationCounts = () => {
    const counts = {
      all: notifications.length,
      requests: notifications.filter(n => n.category === 'requests').length,
      alerts: notifications.filter(n => n.category === 'alerts').length,
    };
    return counts;
  };

  const counts = getNotificationCounts();

  const handleEnterSelectionMode = () => {
    setIsSelectionMode(true);
    setSelectedNotifications(new Set());
  };

  const handleExitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedNotifications(new Set());
  };

  const handleToggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = () => {
    selectedNotifications.forEach(notificationId => {
      removeNotification(notificationId);
    });
    setIsSelectionMode(false);
    setSelectedNotifications(new Set());
  };

  const handleSelectAll = () => {
    const allIds = filteredNotifications.map(n => n.id);
    setSelectedNotifications(new Set(allIds));
  };

  const filteredNotifications = notifications.filter(notification =>
    activeFilter === 'all' || notification.category === activeFilter
  );

  const handleCardPress = (notification: any) => {
    if (isSelectionMode) {
      // In selection mode, toggle selection instead of navigating
      handleToggleNotificationSelection(notification.id);
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

  return (
    <View style={styles.notifyContainer}>
    <FlatList
      data={filteredNotifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <NotificationCard
            notification={item}
            onPress={() => handleCardPress(item)}
            onDelete={() => handleDeleteNotification(item.id)}
            isSelectionMode={isSelectionMode}
            isSelected={selectedNotifications.has(item.id)}
            onToggleSelection={() => handleToggleNotificationSelection(item.id)}
          />
          <View style={styles.divider} />
        </View>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      ListHeaderComponent={
        <View>
          {/* Selection Header - Show when in selection mode */}
          {isSelectionMode && (
            <View style={styles.selectionHeader}>
              <TouchableOpacity onPress={handleExitSelectionMode} style={styles.cancelButton}>
                <Ionicons name="close" size={24} color="#34495E" />
              </TouchableOpacity>
              <Text style={styles.selectionTitle}>
                {selectedNotifications.size} selected
              </Text>
              <TouchableOpacity onPress={handleSelectAll} style={styles.selectAllButton}>
                <Text style={styles.selectAllText}>Select All</Text>
              </TouchableOpacity>
              {selectedNotifications.size > 0 && (
                <TouchableOpacity style={styles.deleteSelectedButton} onPress={handleDeleteSelected}>
                  <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Filter Tabs */}
          <NotificationFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={counts}
          />

          {/* Display Notification API Data */}
          {/* <View style={{ marginTop: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>Notification API Data:</Text>
            <Text>{JSON.stringify(notifications, null, 2)}</Text>
          </View> */}


          {/* Bulk Delete Button - Show below filters when not in selection mode */}
          {!isSelectionMode && notifications.length > 0 && (
            <View style={styles.bulkActionsContainer}>
              <TouchableOpacity style={styles.bulkDeleteButton} onPress={handleEnterSelectionMode}>
                <View style={styles.deleteButtonContent}>
                  <Ionicons name="trash-outline" size={14} color="#E74C3C" />
                  <Text style={styles.deleteButtonText}>Delete All</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications found</Text>
          <Text style={styles.emptySubtext}>
            {activeFilter === 'all'
              ? 'You\'re all caught up!'
              : `No ${activeFilter} notifications at the moment.`}
          </Text>
        </View>
      }
    />
    </View>
  );
}
