import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CustomInput from '@/components/common/CustomInput';
import { onboardingApi } from '@/services/api';
import { basicsSchema } from '@/validation/validationListSchemas';
import onboardingStyles from './onboarding.styles';

export default function BusinessBrandBasicsScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(basicsSchema),
    defaultValues: {
      storeName: '',
      storeEmail: '',
      phone: '',
      description: '',
    },
  });

  const [logo, setLogo] = useState<string | null>(null);
  const [cover, setCover] = useState<string | null>(null);

  const pickImage = async (
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    type: 'logo' | 'cover' = 'logo'
  ) => {
    // Show options to choose between camera and gallery
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Take Photo',
          onPress: () => launchCamera(setImage, type),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => launchGallery(setImage, type),
        },
      ]
    );
  };

  const launchCamera = async (
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    type: 'logo' | 'cover'
  ) => {
    // Request camera permission
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera to take photos.');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: type === 'logo' ? [1, 1] : [16, 9], // Square for logo, wide for cover
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const launchGallery = async (
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    type: 'logo' | 'cover'
  ) => {
    // Request gallery permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload an image.');
      return;
    }

    // Launch image picker with different settings for logo vs cover
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: type === 'logo' ? [1, 1] : [16, 9], // Square for logo, wide for cover
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  useEffect(()=>{
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
       // console.log('Token in BusinessBrandBasicsScreen:', token);
        console.log('Token exists:', !!token);
      } catch (error) {
        console.error('Error getting token:', error);
      }
    };

    checkToken();
  },[])

  const onSubmit = async (data: any) => {
    try {
      // Prepare data for API call
      const storeDetailsData = {
        storeName: data.storeName,
        storeEmail: data.storeEmail,
        phone: data.phone,
        description: data.description,
        logo: logo,
        cover: cover,
      };
alert( storeDetailsData);
      console.log('Submitting store details:', storeDetailsData);

      // Call the API to submit store details (token handled by interceptor)
      await onboardingApi.submitStoreDetails(storeDetailsData);

      // Save to local storage for offline access
      const existingDataStr = await AsyncStorage.getItem('onboardingData');
      const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};

      const updatedData = {
        ...existingData,
        basics: {
          ...data,
          logo,
          cover,
        },
        step: 1,
        completedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('onboardingData', JSON.stringify(updatedData));

      // Navigate to next screen
      router.push('/screens/onboarding/BusinessBrandLocationScreen');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save store details. Please try again.');
    }
  };

  const handleJump = async () => {
    // Optional: save empty basics if skipped
    try {
      const emptyBasics = {
        storeName: '',
        storeEmail: '',
        phone: '',
        description: '',
        logo: null,
        cover: null,
      };
      const existingDataStr = await AsyncStorage.getItem('onboardingData');
      const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};
      await AsyncStorage.setItem(
        'onboardingData',
        JSON.stringify({ ...existingData, basics: emptyBasics, step: 1 })
      );
    } catch (error) {
      console.error('Jump save error:', error);
    }
    router.push('/screens/onboarding/BusinessBrandLocationScreen');
  };

  return (
    <View style={onboardingStyles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={onboardingStyles.header}>
        <Text style={onboardingStyles.headerTitle}>Your Store</Text>
      </View>

      {/* Progress */}
      <View style={onboardingStyles.progressContainer}>
        <Text style={onboardingStyles.progressText}>Complete your store details! 1/3</Text>
      </View>

      <ScrollView contentContainerStyle={onboardingStyles.contentContainer}>
        <Text style={onboardingStyles.sectionTitle}>Store Basics</Text>

        {/* Store Name */}
        <Controller
          control={control}
          name="storeName"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Store Name *"
              placeholder="My Awesome Store"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.storeName?.message}
            />
          )}
        />

        {/* Store Email */}
        <Controller
          control={control}
          name="storeEmail"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Store Email *"
              placeholder="store@example.com"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.storeEmail?.message}
            />
          )}
        />

        {/* Phone Number */}
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Phone Number *"
              placeholder="+39 123 456 789"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.phone?.message}
            />
          )}
        />

        {/* Logo Upload */}
        <Text style={onboardingStyles.fieldLabel}>Logo Image (Recommended)</Text>
        <TouchableOpacity style={onboardingStyles.imageButton} onPress={() => pickImage(setLogo, 'logo')}>
          <Text style={onboardingStyles.buttonText}>
            {logo ? 'Change Logo' : 'Upload Logo'}
          </Text>
        </TouchableOpacity>
        {logo && <Image source={{ uri: logo }} style={onboardingStyles.previewImage} />}

        {/* Cover Upload */}
        <Text style={onboardingStyles.fieldLabel}>Cover Image (Recommended)</Text>
        <TouchableOpacity style={onboardingStyles.imageButton} onPress={() => pickImage(setCover, 'cover')}>
          <Text style={onboardingStyles.buttonText}>
            {cover ? 'Change Cover' : 'Upload Cover'}
          </Text>
        </TouchableOpacity>
        {cover && <Image source={{ uri: cover }} style={onboardingStyles.previewImage} />}

        {/* Store Description */}
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Store Description *"
              placeholder="Tell customers about your store, your products, and what makes you special..."
              multiline
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.description?.message}
            />
          )}
        />
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={onboardingStyles.buttonContainer}>
        {/* <TouchableOpacity style={onboardingStyles.jumpButton} onPress={handleJump}>
          <Text style={onboardingStyles.buttonText}>JUMP</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={onboardingStyles.sendButton} onPress={handleSubmit(onSubmit)}>
          <Text style={onboardingStyles.buttonText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}