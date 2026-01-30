import React, { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DashboardSections, KPICards, OnboardingModal, QRScannerModal, StoreInfoAndKPIs, TimeFilters } from '../../components/dashboard';
import { useDashboard } from '../../hooks/useDashboard';
import { styles } from '../../styles/tabs/dashboard';

export default function DashboardScreen() {
  const {
    selectedTimeFilter,
    selectedProductSubFilter,
    showOnboardingModal,
    dashboardData,
    metricsData,
    storeName,
    storeLogo,
    storeStatus,
    vacationMode,
    setSelectedTimeFilter,
    setSelectedProductSubFilter,
    handleStartOnboarding,
    handleSkipOnboarding,
  } = useDashboard();
// console.log('------dashboardData-------', JSON.stringify(dashboardData, null, 2));
// console.log('------metricsData-------', JSON.stringify(metricsData, null, 2));
// console.log('CTR', metricsData?.conversionRates?.clickThroughRate);


  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const panGestureRef = useRef(null);

  const handleSwipeRight = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      // Detect right swipe with minimum distance
      if (translationX > 100) {
        setShowQRScanner(true);
      }
    }
  };

  const handleQRScanSuccess = (data: string) => {
    setScannedData(data);
    // Here you can process the scanned data as needed
    // For now, we'll just store it and display it on the dashboard
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['right',  'left']}>
      <PanGestureHandler
        ref={panGestureRef}
        onGestureEvent={handleSwipeRight}
        onHandlerStateChange={handleSwipeRight}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {scannedData && (
            <View style={styles.scannedDataContainer}>
              <Text style={styles.scannedDataTitle}>Scanned QR Code:</Text>
              <Text style={styles.scannedDataText}>{scannedData}</Text>
            </View>
          )}

          <StoreInfoAndKPIs
            storeName={storeName}
            storeLogo={storeLogo}
            storeStatus={storeStatus}
            vacationMode={vacationMode}
           // totalViews={dashboardData.totalViews}
            //bookings={dashboardData.bookings}
           // conversion={dashboardData.conversion}
          />

          <TimeFilters
            selectedTimeFilter={selectedTimeFilter}
            onTimeFilterChange={setSelectedTimeFilter}
          />

          <KPICards
            totalViews={dashboardData.totalViews}
            bookings={dashboardData.bookings}
            conversion={dashboardData.conversion}
          />

          <DashboardSections
            dashboardData={dashboardData}
            metricsData={metricsData}
            selectedProductSubFilter={selectedProductSubFilter}
            onProductSubFilterChange={setSelectedProductSubFilter}
          />
        </ScrollView>
      </PanGestureHandler>

      <OnboardingModal
        visible={showOnboardingModal}
        onStartOnboarding={handleStartOnboarding}
        onSkipOnboarding={handleSkipOnboarding}
      />

      <QRScannerModal
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScanSuccess}
      />
    </SafeAreaView>
  );
}

