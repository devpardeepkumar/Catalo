import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/components/notifications/NotificationCard';
import { Notification } from '../../types/notification';

interface NotificationCardProps {
  notification: Notification;
  onPress?: () => void;
  onDelete?: () => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
  onDelete,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelection,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'new':
        return <Ionicons name="radio-button-on" size={16} color="#3498DB" />;
      case 'product_alert':
        return <Ionicons name="cube" size={16} color="#E67E22" />;
      case 'warning':
        return <Ionicons name="warning" size={16} color="#F39C12" />;
      case 'cancellation':
        return <Ionicons name="close-circle" size={16} color="#E74C3C" />;
      case 'urgent_reservation':
        return <Ionicons name="time" size={16} color="#9B59B6" />;
      default:
        return <Ionicons name="notifications" size={16} color="#95A5A6" />;
    }
  };

  const getTimeString = () => {
    const now = new Date();
    const diff = now.getTime() - notification.timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getUrgentTimeLeft = () => {
    if (notification.type === 'urgent_reservation' && notification.metadata?.timeLeft) {
      return `${notification.metadata.timeLeft} min left`;
    }
    return null;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        {isSelectionMode && (
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={(e) => {
              e.stopPropagation();
              onToggleSelection?.();
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.leftSection}>
          {!notification.isRead && !isSelectionMode && <View style={styles.unreadDot} />}
          <View style={styles.icon}>{getIcon()}</View>
          <View style={styles.content}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.message}>{notification.message}</Text>
            {getUrgentTimeLeft() && (
              <Text style={styles.urgentTime}>{getUrgentTimeLeft()}</Text>
            )}
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.timestamp}>{getTimeString()}</Text>
          {!isSelectionMode && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation(); // Prevent triggering onPress
                onDelete?.();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color="#E74C3C" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
