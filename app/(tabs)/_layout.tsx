import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';

import { ProfileBottomSheet } from '@/components/common/ProfileBottomSheet';
import { ProfileHeader } from '@/components/common/ProfileHeader';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useNotifications } from '@/context/NotificationsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { unreadCount } = useNotifications();
  const router = useRouter();
  const [showProfileSheet, setShowProfileSheet] = useState(false);

  const handleProfilePress = () => {
    setShowProfileSheet(true);
  };

  const handleViewProfile = () => {
    router.push('/screens/profile');
  };

  return (
    <>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerStyle: {
          backgroundColor: '#34495E', 
        },
        headerTitleStyle: {
          color: '#ffffff',
          fontSize:24,
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
        headerRight: () => <ProfileHeader onProfilePress={handleProfilePress} />,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart-outline" size={28} color={color} />,
        }}
      /> */}
      {/* <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={28} color={color} />,
        }}
      /> */}
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarLabel: 'Inventory',
          tabBarIcon: ({ color }) => <Ionicons name="cube-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: 'Reservations',
          tabBarLabel: 'Reservations',
          tabBarIcon: ({ color }) => <Ionicons name="time-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color }) => <Ionicons name="notifications-outline" size={28} color={color} />,
          tabBarBadge: unreadCount > 0 ? unreadCount.toString() : undefined,
        }}
      />
    </Tabs>
    <ProfileBottomSheet
      visible={showProfileSheet}
      onClose={() => setShowProfileSheet(false)}
      onViewProfile={handleViewProfile}
    />
  </>
  );
}
