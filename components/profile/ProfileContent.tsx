import { Ionicons } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/tabs/profile';
import { PrivacyGDPRSection } from './PrivacyGDPRSection';

interface GalleryMediaItem {
  uri: string;
  type?: 'image' | 'video';
}

interface ProfileContentProps {
  profileData: any;
  logoUri: string | null;
  coverImageUri: string | null;
  galleryMedia: (string | GalleryMediaItem)[];
  onPickImage: (setImage: React.Dispatch<React.SetStateAction<string | null>>) => void;
  onPickMedia: () => void;
  onExportData: () => void;
  onCookieConsent: (action: 'allow' | 'deny') => void;
  onDeleteAccount: () => void;
}

// Helper function to determine if a URI is a video
const isVideo = (uri: string | GalleryMediaItem): boolean => {
  if (typeof uri === 'object' && uri.type === 'video') {
    return true;
  }
  const uriString = typeof uri === 'string' ? uri : uri.uri;
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.3gp'];
  return videoExtensions.some(ext => uriString.toLowerCase().endsWith(ext));
};

// Helper function to get URI string
const getUri = (item: string | GalleryMediaItem): string => {
  return typeof item === 'string' ? item : item.uri;
};

// Video component using expo-video
const VideoItem: React.FC<{ uri: string }> = ({ uri }) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
    player.muted = false;
  });

  return (
    <View style={styles.galleryImage}>
      <VideoView
        player={player}
        style={styles.galleryImage}
        contentFit="cover"
        nativeControls
      />
    </View>
  );
};

export const ProfileContent: React.FC<ProfileContentProps> = ({
  profileData,
  logoUri,
  coverImageUri,
  galleryMedia,
  onPickImage,
  onPickMedia,
  onExportData,
  onCookieConsent,
  onDeleteAccount,
}) => {
  return (
    <>
      <View style={styles.mainCon}>
        {/* Cover Image Banner with Overlapping Logo */}
        <View style={styles.coverImageContainer}>
          <Image
            source={{ uri: coverImageUri || 'https://via.placeholder.com/800x300' }}
            style={styles.coverImage}
          />
          <TouchableOpacity onPress={() => onPickImage(() => {})} style={styles.logo}>
            <Image
              source={{ uri: logoUri || 'https://via.placeholder.com/100' }}
              style={{ width: 90, height: 90, borderRadius: 50 }}
            />
          </TouchableOpacity>
          <View style={styles.storeInfoOverlay}>
            <Text style={styles.storeNameOverlay}>
              {profileData?.basics?.storeName || 'My Store'}
            </Text>
            <Text style={styles.storeAddressOverlay}>
              {profileData?.location ?
                `${profileData.location.address}, ${profileData.location.city}, ${profileData.location.postalCode}` :
                'Location not set'
              }
            </Text>
          </View>
        </View>
      </View>

      {/* Store Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Store Description</Text>
        <Text style={styles.sectionContent}>
          {profileData?.basics?.description ||
            'Welcome to our store! We offer a wide range of high-quality products and exceptional customer service.'
          }
        </Text>
      </View>

      {/* Store Category */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Store Category</Text>
        <View style={styles.categoryContainer}>
          <Ionicons name="pricetag-outline" size={16} color="#34495E" />
          <Text style={styles.categoryText}>
            {profileData?.basics?.category || 'General Store'}
          </Text>
        </View>
      </View>

      {/* Location Details */}
      {profileData?.location && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationItem}>
              <Ionicons name="location-outline" size={16} color="#34495E" />
              <Text style={styles.locationItemText}>{profileData.location.address}</Text>
            </View>
            <View style={styles.locationItem}>
              <Ionicons name="business-outline" size={16} color="#34495E" />
              <Text style={styles.locationItemText}>{profileData.location.city}, {profileData.location.postalCode}</Text>
            </View>
            <View style={styles.locationItem}>
              <Ionicons name="flag-outline" size={16} color="#34495E" />
              <Text style={styles.locationItemText}>{profileData.location.state}</Text>
            </View>
            {profileData.location.latitude && profileData.location.longitude && (
              <View style={styles.locationItem}>
                <Ionicons name="navigate-outline" size={16} color="#34495E" />
                <Text style={styles.locationItemText}>
                  {profileData.location.latitude.toFixed(4)}, {profileData.location.longitude.toFixed(4)}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Business Hours */}
      {profileData?.timeSettings && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Hours</Text>
          <View style={styles.hoursContainer}>
            {profileData.timeSettings.daysTimes?.map((dayTime: any, index: number) => (
              <Text key={index} style={styles.hourItem}>
                {dayTime.day}: {dayTime.openTime} - {dayTime.closeTime}
              </Text>
            ))}
            {profileData.timeSettings.enableVacationMode && (
              <Text style={styles.vacationText}>
                Vacation Mode: {profileData.timeSettings.enableVacationMode ? 'ON' : 'OFF'}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Services Offered */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services Offered</Text>
        <View style={styles.servicesContainer}>
          <Text style={styles.serviceItem}>- Product Reservations</Text>
          <Text style={styles.serviceItem}>- In-store Pickup</Text>
          <Text style={styles.serviceItem}>- Expert Consultation</Text>
        </View>
      </View>

      {/* Images & Videos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Store Gallery</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
          {galleryMedia.length > 0 ? (
            galleryMedia.map((item, index) => {
              const uri = getUri(item);
              const isVideoFile = isVideo(item);
              
              if (isVideoFile) {
                // Create a video player for each video
                return (
                  <VideoItem key={index} uri={uri} />
                );
              } else {
                return (
                  <Image key={index} source={{ uri }} style={styles.galleryImage} />
                );
              }
            })
          ) : (
            <>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.galleryImage} />
            </>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.uploadButton} onPress={onPickMedia}>
          <Ionicons name="camera-outline" size={20} color="#34495E" />
          <Text style={styles.uploadButtonText}>Add Photos/Videos</Text>
        </TouchableOpacity>
      </View>

      {/* Holiday Dates Section - Add fallback for missing data */}
      {profileData?.holidays && profileData.holidays.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Holidays & Closures</Text>
          <View style={styles.holidaysContainer}>
            {profileData.holidays.slice(0, 3).map((holiday: any, index: number) => (
              <View key={holiday.id || index} style={styles.holidayItem}>
                <Ionicons name="calendar" size={16} color="#34495E" />
                <View style={styles.holidayInfo}>
                  <Text style={styles.holidayDate}>
                    {new Date(holiday.date).toLocaleDateString() || 'Invalid date'}
                  </Text>
                  <Text style={styles.holidayReason}>
                    {holiday.reason || 'No reason provided'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Privacy & GDPR Section */}
      <PrivacyGDPRSection
        onExportData={onExportData}
        onCookieConsent={onCookieConsent}
        onDeleteAccount={onDeleteAccount}
      />
    </>
  );
};
