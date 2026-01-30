import React from 'react';
import { View } from 'react-native';
import { styles } from '../../styles/components/reservations/ReservationStats';
import { ScrollableTabs } from '../common/ScrollableTabs';

interface ReservationStatsProps {
  activeStatusFilter?: 'all' | 'active' | 'completed' | 'pending' | 'canceled' | 'history';
  onAllPress?: () => void;
  onActivePress?: () => void;
  onPendingPress?: () => void;
  onCompletedPress?: () => void;
  onCanceledPress?: () => void;
  onHistoryPress?: () => void;
}

export const ReservationStats: React.FC<ReservationStatsProps> = ({
  activeStatusFilter = 'all',
  onAllPress,
  onActivePress,
  onPendingPress,
  onCompletedPress,
  onCanceledPress,
  onHistoryPress,
}) => {
  // Mock data - in real app this would come from context/state
  // const stats = {
  //   all: 19,
  //   active: 4,
  //   completed: 8,
  //   pending: 5,
  //   canceled: 2,
  //   history: 10,
  //   potentialRevenue: 12450,
  // };


  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
    { key: 'canceled', label: 'Canceled' },
    { key: 'history', label: 'History' },
  ];

  const handleTabPress = (tabKey: string) => {
    switch (tabKey) {
      case 'all':
        onAllPress?.();
        break;
      case 'active':
        onActivePress?.();
        break;
      case 'pending':
        onPendingPress?.();
        break;
      case 'completed':
        onCompletedPress?.();
        break;
      case 'canceled':
        onCanceledPress?.();
        break;
      case 'history':
        onHistoryPress?.();
        break;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollableTabs
        tabs={tabs}
        activeTab={activeStatusFilter || 'all'}
        onTabPress={handleTabPress}
      />
    </View>
  );
};
