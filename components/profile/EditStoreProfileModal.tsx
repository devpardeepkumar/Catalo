import { MultiStepModal, StepConfig } from '@/components/common/MultiStepModal';
import { useStoreProfileForm } from '@/hooks/useStoreProfileForm';
import { EditStoreProfileModalProps } from '@/types/componentsType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert } from 'react-native';
import { AdvancedLocationStep } from './AdvancedLocationStep';
import { StoreBasicsStep } from './StoreBasicsStep';
import { StoreHoursStep } from './StoreHoursStep';

export const EditStoreProfileModal: React.FC<EditStoreProfileModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const formState = useStoreProfileForm(initialData);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to change the logo!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        formState.setLogoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const pickCoverImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to change the cover image!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        formState.setCoverImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking cover image:', error);
      Alert.alert('Error', 'Failed to pick cover image. Please try again.');
    }
  };

  // Create step configurations
  const steps: StepConfig[] = [
    {
      id: 'basics',
      title: 'Store Images & Basic Information',
      content: (
        <StoreBasicsStep
          storeName={formState.storeName}
          storeEmail={formState.storeEmail}
          phone={formState.phone}
          description={formState.description}
          logoUri={formState.logoUri}
          coverImageUri={formState.coverImageUri}
          category={formState.category}
          errors={formState.errors}
          setStoreName={formState.setStoreName}
          setStoreEmail={formState.setStoreEmail}
          setPhone={formState.setPhone}
          setDescription={formState.setDescription}
          setCategory={formState.setCategory}
          pickImage={pickImage}
          pickCoverImage={pickCoverImage}
        />
      ),
      validation: formState.validateBasicsStep,
      onNext: formState.handleBasicsNext,
    },
    {
      id: 'location',
      title: 'Location',
      content: (
        <AdvancedLocationStep
          address={formState.address}
          city={formState.city}
          postalCode={formState.postalCode}
          state={formState.state}
          country={formState.country}
          errors={formState.errors}
          setAddress={formState.setAddress}
          setCity={formState.setCity}
          setpostalCode={formState.setpostalCode}
          setState={formState.setState}
          setCountry={formState.setCountry}
          initialLatitude={initialData?.location?.latitude}
          initialLongitude={initialData?.location?.longitude}
        />
      ),
      validation: formState.validateLocationStep,
      onNext: formState.handleLocationNext,
    },
    {
      id: 'hours',
      title: 'Business Hours',
      content: (
        <StoreHoursStep
          businessHours={formState.businessHours}
          holidayDates={formState.holidayDates}
          showDatePicker={formState.showDatePicker}
          selectedHolidayDate={formState.selectedHolidayDate}
          holidayReason={formState.holidayReason}
          updateBusinessHour={formState.updateBusinessHour}
          setShowDatePicker={formState.setShowDatePicker}
          setSelectedHolidayDate={formState.setSelectedHolidayDate}
          setHolidayReason={formState.setHolidayReason}
          addHoliday={formState.addHoliday}
          removeHoliday={formState.removeHoliday}
        />
      ),
      onNext: formState.handleHoursNext,
    },
  ];

  const handleSave = async () => {
    try {
      const profileData = formState.getAllData();

      // Save to AsyncStorage
      await AsyncStorage.setItem('onboardingData', JSON.stringify(profileData));

      onSave(profileData);
      onClose();

      Alert.alert('Success', 'Store profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
      throw error;
    }
  };

  return (
    <MultiStepModal
      visible={visible}
      onClose={onClose}
      onSave={handleSave}
      steps={steps}
      title="Edit Store Profile"
      loading={formState.loading}
      saveButtonText="Save Changes"
      showResetButton={true}
      onReset={formState.resetForm}
    />
  );
};


