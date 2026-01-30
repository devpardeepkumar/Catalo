import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/components/reservations/ReservationFilters';

interface ReservationFiltersProps {
  activeFilter: 'requests' | 'history';
  onFilterChange: (filter: 'requests' | 'history') => void;
}

export const ReservationFilters: React.FC<ReservationFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.filterTab,
          activeFilter === 'requests' && styles.activeFilterTab,
        ]}
        onPress={() => onFilterChange('requests')}
      >
        <View style={styles.tabContent}>
          <Text style={[
            styles.tabIcon,
            activeFilter === 'requests' && styles.activeTabIcon,
          ]}>
          </Text>
          <Text style={[
            styles.tabText,
            activeFilter === 'requests' && styles.activeTabText,
          ]}>
            Requests
          </Text>
          <View style={[
            styles.badge,
            activeFilter === 'requests' && styles.activeBadge,
          ]}>
            <Text style={[
              styles.badgeText,
              activeFilter === 'requests' && styles.activeBadgeText,
            ]}>
              8
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterTab,
          activeFilter === 'history' && styles.activeFilterTab,
        ]}
        onPress={() => onFilterChange('history')}
      >
        <View style={styles.tabContent}>
          <Text style={[
            styles.tabIcon,
            activeFilter === 'history' && styles.activeTabIcon,
          ]}>
          
          </Text>
          <Text style={[
            styles.tabText,
            activeFilter === 'history' && styles.activeTabText,
          ]}>
            History
          </Text>
          <View style={[
            styles.badge,
            activeFilter === 'history' && styles.activeBadge,
          ]}>
            <Text style={[
              styles.badgeText,
              activeFilter === 'history' && styles.activeBadgeText,
            ]}>
              5
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
