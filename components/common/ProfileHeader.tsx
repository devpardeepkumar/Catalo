import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../context/UserContext';
import { useColorScheme } from '../../hooks/use-color-scheme';

interface ProfileHeaderProps {
  onProfilePress?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onProfilePress }) => {
  const { user } = useUser();
  const colorScheme = useColorScheme();

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    }
  };

  if (!user) {
    return null;
  }

  const isDark = colorScheme === 'dark';

  // Ensure consistent colors across platforms
  const circleBackgroundColor = '#0a7ea4'; // Consistent blue background
  const textColor = isDark ? '#000000' : '#ffffff'; // Black text in dark mode, white in light mode

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleProfilePress}
      activeOpacity={Platform.OS === 'ios' ? 0.7 : 0.8} // Slightly different opacity for iOS
    >
      <View style={[styles.circleContainer, styles.circleBackground]}>
        <Text style={[styles.userName, isDark && styles.darkText]}>
          {user.firstName?.charAt(0).toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    //paddingVertical: 8,

  },
  circleContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#34495E',
    borderWidth: 1,
    marginBottom: Platform.OS === "ios" ? 8 : 2,
  },
  circleBackground: {
    backgroundColor: 'rgb(200, 201, 201)', // Consistent blue background for all platforms and themes
    // This ensures the background color works properly on both iOS and Android
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E', // Light mode text color
  },
  darkText: {
    color: '#34495E', // Dark mode text color for contrast
  },
});
