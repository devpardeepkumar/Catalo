import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styles } from '../../styles/components/inventory/TabNavigation';

export type TabType = 'published' | 'to_be_published' | 'without_info';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const handleTabPress = (tab: TabType) => {
    onTabChange(tab);
  };

  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'published' && styles.activeTab]}
        onPress={() => handleTabPress('published')}
      >
        <Text style={[styles.tabText, activeTab === 'published' && styles.activeTabText]}>
          Published
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'to_be_published' && styles.activeTab]}
        onPress={() => handleTabPress('to_be_published')}
      >
        <Text style={[styles.tabText, activeTab === 'to_be_published' && styles.activeTabText]}>
          To Be Published
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'without_info' && styles.activeTab]}
        onPress={() => handleTabPress('without_info')}
      >
        <Text style={[styles.tabText, activeTab === 'without_info' && styles.activeTabText]}>
          No Product Info
        </Text>
      </TouchableOpacity>
    </View>
  );
};
