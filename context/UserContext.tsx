import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api/authApi';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  sex?: string | null;
  dateOfBirth?: string;
  isEmailVerified?: boolean;
  role?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user data from /auth/me API
  const fetchUserData = async () => {
    try {
      const response = await authApi.getMe();

      // Extract user data from nested structure: response.data.user
      const userData = response.data?.user ;
      if (!userData) {
        throw new Error('Invalid API response structure - missing user data');
      }

      // Transform API response to match User interface
      const transformedUser = {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        sex: userData.sex || null,
        dateOfBirth: userData.dateOfBirth,
        isEmailVerified: userData.isEmailVerified,
        role: userData.role
      };

      setUser(transformedUser);
    } catch (error) {
      console.error('UserContext: Error fetching /auth/me data:', error);
      console.error('UserContext: Error details:', (error as any)?.response?.data || (error as any)?.message || error);

      // Fallback to AsyncStorage if API fails
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUser(JSON.parse(storedUserData));
        }
      } catch (storageError) {
        console.error('UserContext: Error loading stored user data:', storageError);
      }
    }
  };

  // Refresh user data method for login
  const refreshUser = async () => {
    setIsLoading(true);
    await fetchUserData();
    setIsLoading(false);
  };

  useEffect(() => {
    // Fetch user data from /auth/me API on app start
    fetchUserData().finally(() => setIsLoading(false));
  }, []);

  const updateUser = async (newUser: User | null) => {
    setUser(newUser);
    try {
      if (newUser) {
        await AsyncStorage.setItem('userData', JSON.stringify(newUser));
      } else {
        await AsyncStorage.removeItem('userData');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const value: UserContextType = {
    user,
    setUser: updateUser,
    refreshUser,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
