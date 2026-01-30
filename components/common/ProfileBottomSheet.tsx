import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useUser } from '../../context/UserContext';

const { height } = Dimensions.get('window');

interface ProfileBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onViewProfile: () => void;
}

export const ProfileBottomSheet: React.FC<ProfileBottomSheetProps> = ({
  visible,
  onClose,
  onViewProfile,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(true);
  const [storeName, setStoreName] = useState<string>('My Store');
  const [slideAnim] = useState(new Animated.Value(height));

  useEffect(() => {
    loadStoreStatus();
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: height,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();
    }
  }, [visible]);

  const loadStoreStatus = async () => {
    try {
      const storeStatusStr = await AsyncStorage.getItem('storeStatus');
      if (storeStatusStr) {
        const storeStatus = JSON.parse(storeStatusStr);
        setIsStoreOpen(storeStatus.isOpen ?? true);
      }

      // Load store name from onboarding data
      const onboardingDataStr = await AsyncStorage.getItem('onboardingData');
      if (onboardingDataStr) {
        const onboardingData = JSON.parse(onboardingDataStr);
        setStoreName(onboardingData?.basics?.storeName || 'My Store');
      }
    } catch (error) {
      console.error('Error loading store data:', error);
    }
  };

  const handleToggleStoreStatus = async (value: boolean) => {
    try {
      setIsStoreOpen(value);

      // Save to AsyncStorage
      await AsyncStorage.setItem('storeStatus', JSON.stringify({
        isOpen: value,
        updatedAt: new Date().toISOString()
      }));

      Alert.alert(
        'Store Status Updated',
        `Your store is now ${value ? 'OPEN' : 'CLOSED'}`
      );
    } catch (error) {
      console.error('Error updating store status:', error);
      Alert.alert('Error', 'Failed to update store status. Please try again.');
      setIsStoreOpen(!value); // Revert on error
    }
  };

  const handleViewProfile = () => {
    onClose();
    onViewProfile();
  };

  const handleViewUserDetails = () => {
    onClose();
    router.push('/screens/UserDetailsScreen');
  };

  const handleLogout = async () => {
    alert('done logout')
    // try {
    //   await AsyncStorage.clear();
    //   onClose();
    //   router.replace('/auth/Login'); // Navigate to your login/auth screen
    // } catch (error) {
    //   console.error('Error logging out:', error);
    //   Alert.alert('Error', 'Failed to log out. Please try again.');
    // }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} activeOpacity={1} />
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Profile Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.firstName?.charAt(0).toUpperCase() || 'S'}
                </Text>
              </View>
            </View>
            <Text style={styles.storeName}>{storeName}</Text>
            <Text style={[styles.statusText, isStoreOpen ? styles.openText : styles.closedText]}>
              {isStoreOpen ? 'Open' : 'Closed'}
            </Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {/* Store Status Toggle */}
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={isStoreOpen ? "storefront" : "storefront-outline"}
                  size={24}
                  color="#34495E"
                />
                <Text style={styles.menuItemText}>
                  Set store as {isStoreOpen ? 'Closed' : 'Open'}
                </Text>
              </View>
              <Switch
                value={isStoreOpen}
                onValueChange={handleToggleStoreStatus}
                trackColor={{ false: '#E74C3C', true: '#27AE60' }}
                thumbColor="#ffffff"
              />
            </View>

            <TouchableOpacity style={styles.menuItem} onPress={handleViewProfile}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="person-outline" size={24} color="#34495E" />
                <Text style={styles.menuItemText}>Store Detail</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#BDC3C7" />
            </TouchableOpacity>


            <TouchableOpacity style={styles.menuItem} onPress={handleViewUserDetails}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="person-outline" size={24} color="#34495E" />
                <Text style={styles.menuItemText}>profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#BDC3C7" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="log-out-outline" size={24} color="#E74C3C" />
                <Text style={[styles.menuItemText, { color: '#E74C3C' }]}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 34,
    maxHeight: '60%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#BDC3C7',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#34495E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E0E6ED',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  storeName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  openText: {
    color: '#27AE60',
  },
  closedText: {
    color: '#E74C3C',
  },
  menuContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: '#34495E',
    marginLeft: 16,
    fontWeight: '500',
  },
});