import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/components/notifications/NotificationFilters';
import { NotificationType } from '../../types/notification';

interface NotificationFiltersProps {
  activeFilter: NotificationType;
  onFilterChange: (filter: NotificationType) => void;
  counts: Record<NotificationType, number>;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  const tabs = [
    { key: 'all' as NotificationType, label: 'All', icon: '' },
    { key: 'requests' as NotificationType, label: 'Requests', icon: '' },
    { key: 'alerts' as NotificationType, label: 'Alerts', icon: '' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.filterTab,
            activeFilter === tab.key && styles.activeFilterTab,
          ]}
          onPress={() => onFilterChange(tab.key)}
        >
          <View style={styles.tabContent}>
            <Text style={[
              styles.tabIcon,
              activeFilter === tab.key && styles.activeTabIcon,
            ]}>
              {tab.icon}
            </Text>
            <Text style={[
              styles.tabText,
              activeFilter === tab.key && styles.activeTabText,
            ]}>
              {tab.label}
            </Text>
            <View style={[
              styles.badge,
              activeFilter === tab.key && styles.activeBadge,
            ]}>
              <Text style={[
                styles.badgeText,
                activeFilter === tab.key && styles.activeBadgeText,
              ]}>
                {counts[tab.key]}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};
