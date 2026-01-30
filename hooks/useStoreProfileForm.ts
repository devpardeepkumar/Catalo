import { onboardingApi, onboardingHoursApi, onboardingLocationApi } from '@/services/api/onboardingApi';
import { BusinessHours, EditStoreProfileModalProps, HolidayDate } from '@/types/componentsType';
import { StoreBasicsData, StoreLocationData, validateStoreBasics, validateStoreLocation } from '@/utils/validation/storeProfileValidation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const useStoreProfileForm = (initialData?: EditStoreProfileModalProps['initialData']) => {
  // Basic Info State
  const [storeName, setStoreName] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [coverImageUri, setCoverImageUri] = useState<string | null>(null);
  const [category, setCategory] = useState('');

  // Location State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setpostalCode] = useState('');
  const [state, setState] = useState('Italy');
  const [country, setCountry] = useState('Italy');

  // Business Hours State
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>(
    DAYS_OF_WEEK.map(day => ({
      day,
      openTime: '09:00',
      closeTime: '18:00',
      isClosed: day === 'Sunday',
    }))
  );

  // Holiday Dates State
  const [holidayDates, setHolidayDates] = useState<HolidayDate[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedHolidayDate, setSelectedHolidayDate] = useState<Date>(new Date());
  const [holidayReason, setHolidayReason] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      try {
        // Basic info
        setStoreName(initialData.basics?.storeName || '');
        setStoreEmail(initialData.basics?.storeEmail || '');
        setPhone(initialData.basics?.phone || '');
        setDescription(initialData.basics?.description || '');
        setLogoUri(initialData.basics?.logo || null);
        setCoverImageUri(initialData.basics?.coverImage || null);
        setCategory(initialData.basics?.category || 'General Store');

        // Location
        if (initialData.location) {
          setAddress(initialData.location.address || '');
          setCity(initialData.location.city || '');
          setpostalCode(initialData.location.postalCode || '');
          setState(initialData.location.state || 'Italy');
          setCountry(initialData.location.country || 'Italy');
        }

        // Business hours
        if (initialData.timeSettings?.daysTimes) {
          const existingHours = initialData.timeSettings.daysTimes.map((dayTime: any) => ({
            day: dayTime.day,
            openTime: dayTime.openTime || '09:00',
            closeTime: dayTime.closeTime || '18:00',
            isClosed: dayTime.isClosed || false,
          }));
          setBusinessHours(existingHours);
        }

        // Holiday dates
        if (initialData.holidays) {
          const holidays = initialData.holidays.map((holiday: any) => ({
            id: holiday.id || Date.now().toString(),
            date: new Date(holiday.date),
            reason: holiday.reason || '',
          }));
          setHolidayDates(holidays);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        Alert.alert('Error', 'Failed to load existing profile data');
      }
    }
  }, [initialData]);

  // Business Hours Handlers
  const updateBusinessHour = (dayIndex: number, field: keyof BusinessHours, value: string | boolean) => {
    setBusinessHours(prev =>
      prev.map((hour, index) =>
        index === dayIndex ? { ...hour, [field]: value } : hour
      )
    );
  };

  const addHoliday = () => {
    if (!holidayReason.trim()) {
      Alert.alert('Error', 'Please enter a reason for the holiday');
      return;
    }

    const newHoliday: HolidayDate = {
      id: Date.now().toString(),
      date: selectedHolidayDate,
      reason: holidayReason.trim(),
    };

    setHolidayDates(prev => [...prev, newHoliday]);
    setHolidayReason('');
    setSelectedHolidayDate(new Date());
  };

  const removeHoliday = (id: string) => {
    setHolidayDates(prev => prev.filter(holiday => holiday.id !== id));
  };

  // Validation Functions
  const validateBasicsStep = async (): Promise<boolean> => {
    const data: StoreBasicsData = {
      storeName,
      storeEmail,
      phone,
      description,
      category,
    };
    return await validateStoreBasics(data, setErrors);
  };

  const validateLocationStep = async (): Promise<boolean> => {
    const data: StoreLocationData = {
      address,
      city,
      postalCode: postalCode,
      state,
      country,
    };
    return await validateStoreLocation(data, setErrors);
  };

  // Step Actions
  const handleBasicsNext = async () => {
    try {
      setLoading(true);
      const storeDetailsData = {
        storeName: storeName.trim(),
        storeEmail: storeEmail.trim(),
        phone: phone.trim(),
        description: description.trim(),
        logo: logoUri,
        cover: coverImageUri,
      };

      await onboardingApi.submitStoreDetails(storeDetailsData);

      // Save step 1 data to AsyncStorage as backup
      const step1Data = {
        basics: {
          storeName: storeName.trim(),
          storeEmail: storeEmail.trim(),
          phone: phone.trim(),
          description: description.trim(),
          logo: logoUri,
          coverImage: coverImageUri,
          category: category.trim(),
        },
      };
      await AsyncStorage.setItem('step1Data', JSON.stringify(step1Data));
    } catch (error) {
      console.error('Error submitting step 1 data:', error);
      Alert.alert('Error', 'Failed to save basic information. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLocationNext = async () => {
    try {
      setLoading(true);
      const locationData = {
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        state: state.trim(),
        country: country.trim(),
        latitude: initialData?.location?.latitude,
        longitude: initialData?.location?.longitude,
      };

      await onboardingLocationApi.submitLocation(locationData);

      // Save step 2 data to AsyncStorage as backup
      const step2Data = {
        location: locationData,
      };
      await AsyncStorage.setItem('step2Data', JSON.stringify(step2Data));
    } catch (error) {
      console.error('Error submitting location data:', error);
      Alert.alert('Error', 'Failed to save location information. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleHoursNext = async () => {
    try {
      setLoading(true);

      // Transform businessHours data to match HoursData interface
      const hoursData = {
        vacationMode: false, // Match Postman data
        enableReservations: true, // Match Postman data
        enableOpeningHours: true,
        hours: businessHours.map((hour, index) => ({
          dayOfWeek: index, // 0-based indexing: Sunday = 0, Monday = 1, etc.
          openTime: hour.isClosed ? null : hour.openTime,
          closeTime: hour.isClosed ? null : hour.closeTime,
          isClosed: hour.isClosed,
        })),
      };

      await onboardingHoursApi.submitHours(hoursData);

      // Save step 3 data to AsyncStorage as backup
      const step3Data = {
        timeSettings: {
          daysTimes: businessHours.map(hour => ({
            day: hour.day,
            openTime: hour.isClosed ? null : hour.openTime,
            closeTime: hour.isClosed ? null : hour.closeTime,
            isClosed: hour.isClosed,
          })),
          enableVacationMode: initialData?.timeSettings?.enableVacationMode || false,
        },
        holidays: holidayDates.map(holiday => ({
          id: holiday.id,
          date: holiday.date.toISOString(),
          reason: holiday.reason,
        })),
      };
      await AsyncStorage.setItem('step3Data', JSON.stringify(step3Data));
    } catch (error) {
      console.error('Error submitting hours data:', error);
      Alert.alert('Error', 'Failed to save business hours information. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Form Data Getters
  const getBasicsData = () => ({
    storeName,
    storeEmail,
    phone,
    description,
    logoUri,
    coverImageUri,
    category,
  });

  const getLocationData = () => ({
    address,
    city,
    postalCode,
    state,
    country,
  });

  const getHoursData = () => ({
    businessHours,
    holidayDates,
  });

  const getAllData = () => ({
    basics: {
      storeName: storeName.trim(),
      storeEmail: storeEmail.trim(),
      phone: phone.trim(),
      description: description.trim(),
      logo: logoUri,
      coverImage: coverImageUri,
      category: category.trim(),
    },
    location: {
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      state: state.trim(),
      country: country.trim(),
      latitude: initialData?.location?.latitude,
      longitude: initialData?.location?.longitude,
    },
    timeSettings: {
      daysTimes: businessHours.map(hour => ({
        day: hour.day,
        openTime: hour.isClosed ? null : hour.openTime,
        closeTime: hour.isClosed ? null : hour.closeTime,
        isClosed: hour.isClosed,
      })),
      enableVacationMode: initialData?.timeSettings?.enableVacationMode || false,
    },
    holidays: holidayDates.map(holiday => ({
      id: holiday.id,
      date: holiday.date.toISOString(),
      reason: holiday.reason,
    })),
    updatedAt: new Date().toISOString(),
  });

  // Reset Form
  const resetForm = () => {
    if (initialData) {
      // Re-trigger the useEffect to reset to initial data
      setStoreName(initialData.basics?.storeName || '');
      setStoreEmail(initialData.basics?.storeEmail || '');
      setPhone(initialData.basics?.phone || '');
      setDescription(initialData.basics?.description || '');
      setLogoUri(initialData.basics?.logo || null);
      setCoverImageUri(initialData.basics?.coverImage || null);
      setCategory(initialData.basics?.category || 'General Store');
      setAddress(initialData.location?.address || '');
      setCity(initialData.location?.city || '');
      setpostalCode(initialData.location?.postalCode || '');
      setState(initialData.location?.state || 'Italy');
      setCountry(initialData.location?.country || 'Italy');
      setErrors({});
    }
  };

  return {
    // State
    storeName,
    storeEmail,
    phone,
    description,
    logoUri,
    coverImageUri,
    category,
    address,
    city,
    postalCode,
    state,
    country,
    businessHours,
    holidayDates,
    showDatePicker,
    selectedHolidayDate,
    holidayReason,
    loading,
    errors,

    // Setters
    setStoreName,
    setStoreEmail,
    setPhone,
    setDescription,
    setCategory,
    setLogoUri,
    setCoverImageUri,
    setAddress,
    setCity,
    setpostalCode,
    setState,
    setCountry,
    setShowDatePicker,
    setSelectedHolidayDate,
    setHolidayReason,
    setErrors,

    // Handlers
    updateBusinessHour,
    addHoliday,
    removeHoliday,

    // Validation
    validateBasicsStep,
    validateLocationStep,

    // Actions
    handleBasicsNext,
    handleLocationNext,
    handleHoursNext,

    // Data getters
    getBasicsData,
    getLocationData,
    getHoursData,
    getAllData,

    // Utils
    resetForm,
  };
};
