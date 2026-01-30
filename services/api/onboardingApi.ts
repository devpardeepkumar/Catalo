import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';
import { OnboardingStatusResponse } from './types';

// Define types for onboarding data
export interface StoreDetailsData {
  storeName: string;
  storeEmail: string;
  phone: string;
  description: string;
  logo?: string | null;
  cover?: string | null;
}

export interface LocationData {
  address: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface HoursData {
  vacationMode: boolean;
  enableReservations: boolean;
  enableOpeningHours: boolean;
  hours: Array<{
    dayOfWeek: number;
    openTime: string | null;
    closeTime: string | null;
    isClosed: boolean;
  }>;
}

// Add token interceptor to main apiClient for onboarding
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Onboarding API service functions
export const onboardingApi = {
  // Submit store details for onboarding
  submitStoreDetails: async (storeData: StoreDetailsData) => {
    const response = await apiClient.put('/retailers/onboarding/store-details', storeData);
    return response.data;
  },

  // Complete onboarding
  completeOnboarding: async () => {
    const response = await apiClient.post('/retailers/onboarding/complete');
    return response.data;
  },

  // Get onboarding status
  getOnboardingStatus: async (): Promise<OnboardingStatusResponse> => {
    const response = await apiClient.get('/retailers/onboarding/status');
    return response.data;
  },
};

export const onboardingLocationApi = {
  submitLocation: async (locationData: LocationData) => {
    const response = await apiClient.put('/retailers/onboarding/location', locationData);
    return response.data;
  },
};

export const onboardingHoursApi = {
  submitHours: async (hoursData: HoursData) => {
    const response = await apiClient.put('/retailers/onboarding/hours', hoursData);
    return response.data;
  },
};
