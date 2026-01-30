import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface TabItem {
  key: string;
  label: string;
}

interface ScrollableTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  activeColor?: string; // Default to red/orange
  inactiveColor?: string; // Default to white
}

export const ScrollableTabs: React.FC<ScrollableTabsProps> = ({
  tabs,
  activeTab,
  onTabPress,
  activeColor = '#34495E', // Dark blue color
  inactiveColor = '#FFFFFF',
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={120} 
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.key;
          const isLastTab = index === tabs.length - 1;

          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                {
                  backgroundColor: isActive ? activeColor : inactiveColor,
                  marginRight: isLastTab ? 32 : 8, // Extra margin on last tab to show scroll hint
                  borderWidth: isActive ? 0 : 1,
                  borderColor: isActive ? 'transparent' : 'transparent',
                },
              ]}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? '#FFFFFF' : '#2C3E50',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor:'#FFFFFF',
    margin:12,
  },
  scrollContent: {
    paddingRight: 16, 
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
   borderRadius: 2, 
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    //shadowOpacity: 0.1,
    //shadowRadius: 3.84,
    // Elevation for Android
   // elevation: 5,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
