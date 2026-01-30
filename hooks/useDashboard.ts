import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { DASHBOARD_CONSTANTS, type ProductSubFilter, type TimeFilter } from '../constants/dashboard';
import { analyticsApi } from '../services/api/analyticsApi';
import { getSimulatedDashboardData, type DashboardData } from '../services/dashboardData';

export const useDashboard = () => {
  const router = useRouter();
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter>('Total');
  const [selectedProductSubFilter, setSelectedProductSubFilter] = useState<ProductSubFilter>('Most Booked');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>(getSimulatedDashboardData('Total', 'Most Booked'));
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [metricsData, setMetricsData] = useState<any>(null);

  // Load profile data
  const loadProfileData = async () => {
    try {
      const onboardingDataStr = await AsyncStorage.getItem('onboardingData');
      if (onboardingDataStr) {
        const data = JSON.parse(onboardingDataStr);
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  // Check onboarding status
  const checkOnboardingStatus = async () => {
    try {
      const onboardingDataStr = await AsyncStorage.getItem('onboardingData');
      if (onboardingDataStr) {
        const onboardingData = JSON.parse(onboardingDataStr);
        if (!onboardingData.onboardingCompleted) {
          const timer = setTimeout(() => {
            setShowOnboardingModal(true);
          }, DASHBOARD_CONSTANTS.ONBOARDING_DELAY);
          return () => clearTimeout(timer);
        }
      } else {
        const timer = setTimeout(() => {
          setShowOnboardingModal(true);
        }, DASHBOARD_CONSTANTS.ONBOARDING_DELAY);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      const timer = setTimeout(() => {
        setShowOnboardingModal(true);
      }, DASHBOARD_CONSTANTS.ONBOARDING_DELAY);
      return () => clearTimeout(timer);
    }
  };

  // Event handlers
  const handleStartOnboarding = () => {
    setShowOnboardingModal(false);
    router.push('/screens/onboarding/BusinessBrandBasicsScreen');
  };

  const handleSkipOnboarding = () => {
    setShowOnboardingModal(false);
  };

  // Fetch dashboard metrics from API
  const fetchDashboardMetrics = async () => {
    setIsLoadingDashboard(true);
    try {
      const metricsResponse = await analyticsApi.getMetrics();
      const metricsData = metricsResponse?.data || metricsResponse;
      setMetricsData(metricsData);
       //console.log(' Processed data:', JSON.stringify(metricsData, null, 2));
      const simulatedData = getSimulatedDashboardData(selectedTimeFilter, selectedProductSubFilter);

      // Transform API data for different filter types
      let topProducts = simulatedData.topProducts;

      if (selectedProductSubFilter === 'Most Searched' && metricsData?.mostViewed) {

        topProducts = metricsData.mostViewed.map((item: any) => ({
          name: item.productName || 'Unknown Product',
          description: item.categoryName || 'Uncategorized',
          interactions: item.totalViews?.toString() || '0',
          price: item.ean ? `EAN: ${item.ean}` : 'N/A',
        }));
      //  console.log('🛍️ Using API mostViewed data for Most Searched filter:', topProducts);
      } else if (selectedProductSubFilter === 'Most Booked' && metricsData?.mostBooked) {
        // Transform mostBooked API data to Product interface for Most Booked filter
        topProducts = metricsData.mostBooked.map((item: any) => ({
          name: item.productName || 'Unknown Product',
          description: item.categoryName || 'Uncategorized',
          interactions: item.totalQuantity?.toString() || '0',
          price: item.ean ? `EAN: ${item.ean}` : 'N/A',
        }));
        //console.log('📦 Using API mostBooked data for Most Booked filter:', topProducts);
      } else if (selectedProductSubFilter === 'Most Clicked' && metricsData?.bookClicks?.topProducts) {
        // Transform bookClicks.topProducts API data to Product interface for Most Clicked filter
        topProducts = metricsData.bookClicks.topProducts.map((item: any) => ({
          name: item.productName || 'Unknown Product',
          description: `Conversion: ${item.conversionRate}%`,
          interactions: item.bookClicks?.toString() || '0',
          price: `Views: ${item.totalViews}`,
        }));
       // console.log('🖱️ Using API bookClicks data for Most Clicked filter:', topProducts);
      }

      const realDashboardData = {
        ...simulatedData,
        topProducts,
        // Override with real data where available
        totalViews: metricsData?.totalViews || simulatedData.totalViews,
        bookings: metricsData?.bookings || simulatedData.bookings,
        conversion: metricsData?.conversion || simulatedData.conversion,
      };
    
      setDashboardData(realDashboardData);
    } catch (error) {
      setDashboardData(getSimulatedDashboardData(selectedTimeFilter, selectedProductSubFilter));
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  // Initialize data
  useEffect(() => {
    loadProfileData();
    checkOnboardingStatus();
    fetchDashboardMetrics();
  }, []);

  // Update dashboard data when filters change
  useEffect(() => {
    if (!isLoadingDashboard) {
      //console.log('🔄 Filters changed, refetching dashboard data...');
      fetchDashboardMetrics();
    }
  }, [selectedTimeFilter, selectedProductSubFilter]);

  // Computed values
  const storeName = profileData?.basics?.storeName || DASHBOARD_CONSTANTS.DEFAULT_STORE_NAME;
  const storeLogo = profileData?.basics?.logo || DASHBOARD_CONSTANTS.DEFAULT_STORE_LOGO;
  const storeStatus = DASHBOARD_CONSTANTS.STORE_STATUS;
  const vacationMode = DASHBOARD_CONSTANTS.VACATION_MODE;

  return {
    // State
    selectedTimeFilter,
    selectedProductSubFilter,
    showOnboardingModal,
    profileData,
    dashboardData,
    metricsData,
    isLoadingDashboard,

    // Computed values
    storeName,
    storeLogo,
    storeStatus,
    vacationMode,

    // Actions
    setSelectedTimeFilter,
    setSelectedProductSubFilter,
    handleStartOnboarding,
    handleSkipOnboarding,
  };
};
