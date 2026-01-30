import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../context/UserContext';
import { authApi } from '../../services/api/authApi';
import { styles } from '../../styles/screens/userDetails';

export default function UserDetailsScreen() {
  const router = useRouter();
  const { user, setUser, refreshUser } = useUser();


  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    sex: user?.sex || '',
  });


  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        sex: user.sex || '',
      });
    }
  }, [user]);

  // Function to save profile changes
  const saveProfile = async () => {
    try {
      // Call API to update profile
      await authApi.updateProfile({
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        sex: editForm.sex,
      });

      // Refresh user data from /auth/me API to get updated profile
      await refreshUser();
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>User Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centerContainer}>
          <Ionicons name="person-outline" size={48} color="#BDC3C7" />
          <Text style={styles.errorText}>No user information available</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backToProfileButton}>
            <Text style={styles.backToProfileButtonText}>Back to Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>User Details</Text>
        <View style={styles.headerRight}>
        
        </View>
      </View>
      <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
            <Ionicons name={isEditing ? "checkmark" : "create"} size={24} color="#fff" />
          </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* User Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.firstName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user.firstName} {user.lastName}
          </Text>
        </View>

        {/* User Details Section */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="person-outline" size={20} color="#34495E" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>First Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.detailInput}
                  value={editForm.firstName}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, firstName: text }))}
                  placeholder="Enter first name"
                />
              ) : (
                <Text style={styles.detailValue}>{user.firstName}</Text>
              )}
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="person-outline" size={20} color="#34495E" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Last Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.detailInput}
                  value={editForm.lastName}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, lastName: text }))}
                  placeholder="Enter last name"
                />
              ) : (
                <Text style={styles.detailValue}>{user.lastName}</Text>
              )}
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="mail-outline" size={20} color="#34495E" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={styles.detailInput}
                  value={editForm.email}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
                  placeholder="Enter email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.detailValue}>{user.email}</Text>
              )}
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="person-outline" size={20} color="#34495E" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Sex</Text>
              {isEditing ? (
                <TextInput
                  style={styles.detailInput}
                  value={editForm.sex}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, sex: text }))}
                  placeholder="Enter sex"
                />
              ) : (
                <Text style={styles.detailValue}>
                  {user?.sex && typeof user.sex === 'string' && user.sex.trim() !== '' ? user.sex : 'Not specified'}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={20} color="#34495E" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date of Birth</Text>
              <Text style={styles.detailValue}>
                {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not specified'}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#34495E" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Email Verified</Text>
              <Text style={styles.detailValue}>
                {user?.isEmailVerified ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="briefcase-outline" size={20} color="#34495E" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Role</Text>
              <Text style={styles.detailValue}>
                {user?.role || 'Not specified'}
              </Text>
            </View>
          </View>

        </View>

        {isEditing && (
          <View style={styles.saveButtonContainer}>
            <TouchableOpacity onPress={saveProfile} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}