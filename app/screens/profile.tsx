import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EditStoreProfileModal } from '../../components/profile/EditStoreProfileModal';
import { ProfileContent } from '../../components/profile/ProfileContent';
import { getDefaultProfileData } from '../../data/profileData';
import { styles } from '../../styles/tabs/profile';

interface GalleryMediaItem {
  uri: string;
  type?: 'image' | 'video';
}

export default function ProfileScreen() {
  const router = useRouter();
  const [galleryMedia, setGalleryMedia] = useState<(string | GalleryMediaItem)[]>([]);
  const [logoUri, setLogoUri] = useState<string | null>('https://via.placeholder.com/100'); // Placeholder logo
  const [coverImageUri, setCoverImageUri] = useState<string | null>('https://via.placeholder.com/800x300'); // Placeholder cover image
  const [profileData, setProfileData] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const onboardingDataStr = await AsyncStorage.getItem('onboardingData');

      if (onboardingDataStr) {
        let data;
        try {
          data = JSON.parse(onboardingDataStr);
        } catch (parseError) {
        
          // Fallback: Try to recover corrupted data or reset
          data = getDefaultProfileData();
          await AsyncStorage.setItem('onboardingData', JSON.stringify(data));
          Alert.alert('Data Recovery', 'Profile data was corrupted and has been reset to defaults.');
        }

        // Validate and sanitize data
        const sanitizedData = sanitizeProfileData(data);
        setProfileData(sanitizedData);

        // Set logo and cover image with fallbacks
        setLogoUri(sanitizedData.basics?.logo || 'https://via.placeholder.com/100');
        setCoverImageUri(sanitizedData.basics?.coverImage || 'https://via.placeholder.com/800x300');
      } else {
        // No data found - create default profile
        const defaultData = getDefaultProfileData();
        setProfileData(defaultData);
        setLogoUri(defaultData.basics.logo);
        setCoverImageUri(defaultData.basics.coverImage);
      }
    } catch (error) {
      setError('Failed to load profile data');

      // Fallback to default data
      const defaultData = getDefaultProfileData();
      setProfileData(defaultData);
      setLogoUri(defaultData.basics.logo);
      setCoverImageUri(defaultData.basics.coverImage);

      Alert.alert(
        'Loading Error',
        'Unable to load profile data. Using default settings.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Sanitize and validate profile data with fallbacks
  const sanitizeProfileData = (data: any) => {
    try {
      return {
        basics: {
          storeName: data?.basics?.storeName || 'My Store',
          storeEmail: data?.basics?.storeEmail || '',
          phone: data?.basics?.phone || '',
          description: data?.basics?.description || 'Welcome to our store! We offer a wide range of high-quality products and exceptional customer service.',
          logo: data?.basics?.logo || 'https://via.placeholder.com/100',
          coverImage: data?.basics?.coverImage || 'https://via.placeholder.com/800x300',
          category: data?.basics?.category || 'General Store',
        },
        location: {
          address: data?.location?.address || 'Address not set',
          city: data?.location?.city || 'City not set',
          postalCode: data?.location?.postalCode || '',
          state: data?.location?.state || 'Italy',
          latitude: data?.location?.latitude || null,
          longitude: data?.location?.longitude || null,
        },
        timeSettings: {
          daysTimes: data?.timeSettings?.daysTimes || [
            { day: 'Monday', openTime: '09:00', closeTime: '18:00', isClosed: false },
            { day: 'Tuesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
            { day: 'Wednesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
            { day: 'Thursday', openTime: '09:00', closeTime: '18:00', isClosed: false },
            { day: 'Friday', openTime: '09:00', closeTime: '18:00', isClosed: false },
            { day: 'Saturday', openTime: '09:00', closeTime: '18:00', isClosed: false },
            { day: 'Sunday', openTime: null, closeTime: null, isClosed: true },
          ],
          enableVacationMode: data?.timeSettings?.enableVacationMode || false,
        },
        holidays: Array.isArray(data?.holidays) ? data.holidays.map((holiday: any) => ({
          id: holiday?.id || Date.now().toString(),
          date: holiday?.date ? new Date(holiday.date) : new Date(),
          reason: holiday?.reason || 'Holiday',
        })) : [],
        updatedAt: data?.updatedAt || new Date().toISOString(),
      };
    } catch (sanitizeError) {
      return getDefaultProfileData();
    }
  };


  const handleEditProfile = () => {
    if (!profileData) {
      Alert.alert('Error', 'Profile data not loaded yet. Please wait.');
      return;
    }
    setShowEditModal(true);
  };

  const handleSaveProfile = async (updatedData: any) => {
    try {
      setProfileData(updatedData);

      // Update logo and cover image if changed
      if (updatedData.basics?.logo && updatedData.basics.logo !== logoUri) {
        setLogoUri(updatedData.basics.logo);
      }
      if (updatedData.basics?.coverImage && updatedData.basics.coverImage !== coverImageUri) {
        setCoverImageUri(updatedData.basics.coverImage);
      }

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile display. Please refresh the page.');
    }
  };

  const handleRetryLoad = () => {
    setError(null);
    loadProfileData();
  };

  const pickImage = async (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setGalleryMedia((prevMedia) => [
        ...prevMedia,
        ...result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image' as 'image' | 'video',
        })),
      ]);
    }
  };

  // Privacy & GDPR handlers
  const handleExportData = async () => {
    try {
      // Show loading indicator
      Alert.alert('Export Data', 'Preparing your data for download...', [{ text: 'OK' }]);

      // Import the GDPR API
      const { gdprApi } = await import('../../services/api/gdprApi');

      // Call the GDPR export API
      const response = await gdprApi.exportData();

      if (response.success && response.data) {
        // Convert data to JSON string with proper formatting
        const dataString = JSON.stringify(response.data, null, 2);

        // Create file name with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `user-data-export-${timestamp}.json`;

        // Create a temporary file path in cache directory
        const fileUri = FileSystem.cacheDirectory + fileName;

        // Write data to file
        await FileSystem.writeAsStringAsync(fileUri, dataString);

        // Check if sharing is available on the device
        const isSharingAvailable = await Sharing.isAvailableAsync();

        if (isSharingAvailable) {
          // Share the file using native sharing UI
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/json',
            dialogTitle: 'Export User Data',
            UTI: 'public.json', // iOS Universal Type Identifier
          });

          Alert.alert(
            'Export Successful',
            `Your data has been exported and saved as "${fileName}". The file is now available for sharing.`,
            [{ text: 'OK' }]
          );
        } else {
          // Fallback: inform user about file location
          const message = Platform.OS === 'ios'
            ? `Your data has been exported and saved as "${fileName}" in the Files app.`
            : `Your data has been exported and saved as "${fileName}" in your device's Documents folder.`;

          Alert.alert(
            'Export Successful',
            message,
            [{ text: 'OK' }]
          );
        }

        console.log('Exported user data:', response.data);
        console.log('File saved to:', fileUri);
      } else {
        throw new Error(response.message || 'Export failed');
      }
    } catch (error: any) {
      console.error('Error exporting data:', error);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to export data. Please try again.';
      Alert.alert(
        'Export Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    }
  };

  const handleCookieConsent = (action: 'allow' | 'deny') => {
    const message = action === 'allow'
      ? 'Cookie consent has been granted. You can manage your preferences anytime.'
      : 'Cookie consent has been denied. Some features may be limited.';
    Alert.alert('Cookie Consent', message, [{ text: 'OK' }]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Account Deletion Confirmed',
              'Your account deletion request has been submitted. You will be logged out.',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  return (
    <>
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
      </View>
      <Text style={styles.headerTitle}>Retailer Profile</Text>
      <View style={styles.headerRight} />
    </View>
    <SafeAreaView style={styles.safeArea} edges={[ 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.editmain}>
      <TouchableOpacity onPress={handleEditProfile} disabled={loading} style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="#34495E" />
        </TouchableOpacity>
        </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Loading State */}
        {loading && (
          <View style={styles.centerContainer}>
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle" size={48} color="#e74c3c" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={handleRetryLoad} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <ProfileContent
            profileData={profileData}
            logoUri={logoUri}
            coverImageUri={coverImageUri}
            galleryMedia={galleryMedia}
            onPickImage={pickImage}
            onPickMedia={pickMedia}
            onExportData={handleExportData}
            onCookieConsent={handleCookieConsent}
            onDeleteAccount={handleDeleteAccount}
          />
        )}

      </ScrollView>

      {/* Edit Profile Modal */}
      <EditStoreProfileModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
        initialData={profileData}
      />
    </SafeAreaView>
    </>
  );
}
