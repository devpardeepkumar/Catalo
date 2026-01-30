import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
import { ReservationList } from '../../components/reservations/ReservationList';
import { ReservationStats } from '../../components/reservations/ReservationStats';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchReservations } from '../../store/slices/reservationsSlice';
import { styles } from '../../styles/tabs/reservations';

export default function ReservationsScreen() {
  const dispatch = useAppDispatch();
  const reservationsState = useAppSelector((state: any) => state.reservations || {});
  
  const { reservations = [], loading = false, error = null, pagination = null } = reservationsState;


  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'pending' | 'canceled' >('all');
  const [showActiveButton, setShowActiveButton] = useState(false);
  const [showApiJson, setShowApiJson] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownStatusFilter, setDropdownStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled' >('all');

  // Fetch reservations on component mount and when status filter changes
  useEffect(() => {
    const statusToUse = statusFilter === 'all' ? dropdownStatusFilter : statusFilter;
    dispatch(fetchReservations({ page: 1, limit: 20, status: statusToUse }));
  }, [dispatch, statusFilter, dropdownStatusFilter]);

  const handleAllPress = () => {
    setStatusFilter('all');
    setShowActiveButton(false);
    setDropdownStatusFilter('all');
  };

  const handleActivePress = () => {
    setStatusFilter('active');
    setShowActiveButton(true);
  };

  const handlePendingPress = () => {
    setStatusFilter('pending');
    setShowActiveButton(false);
  };

  const handleCompletedPress = () => {
    setStatusFilter('completed');
    setShowActiveButton(false);
  };

  const handleCanceledPress = () => {
    setStatusFilter('canceled');
    setShowActiveButton(false);
  };

  const handleHistoryPress = () => {
    //setStatusFilter('history');
    setShowActiveButton(false);
  };

  const clearStatusFilter = () => {
    setStatusFilter('all');
    setShowActiveButton(false);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      const statusToUse = statusFilter === 'all' ? dropdownStatusFilter : statusFilter;
      dispatch(fetchReservations({ page, limit: 20, status: statusToUse }));
    }
  };

  const handleDropdownStatusChange = (status: 'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled' ) => {
    setDropdownStatusFilter(status);
    setDropdownVisible(false);
    dispatch(fetchReservations({ page: 1, limit: 20, status }));
  };

  const headerContent = (
    <>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Reservations</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#34495E" />
        </TouchableOpacity>
      </View> */}

      {/* Stats Overview */}
      <ReservationStats
        activeStatusFilter={statusFilter}
        onAllPress={handleAllPress}
        onActivePress={handleActivePress}
        onPendingPress={handlePendingPress}
        onCompletedPress={handleCompletedPress}
        onCanceledPress={handleCanceledPress}
        onHistoryPress={handleHistoryPress}
      />

      {/* Status Dropdown Filter - Only show when "All" tab is selected */}
      {statusFilter === 'all' && (
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdownButtonContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setDropdownVisible(!dropdownVisible)}
            >
              <Text style={styles.dropdownButtonText}>
                Status: {dropdownStatusFilter === 'all' ? 'All Statuses' :
                        dropdownStatusFilter === 'confirmed' ? 'Confirmed' :
                        dropdownStatusFilter === 'pending' ? 'Pending' :
                        dropdownStatusFilter === 'completed' ? 'Completed' :
                        dropdownStatusFilter === 'cancelled' ? 'Cancelled' :
                      'All Statuses'}
              </Text>
              <Ionicons
                name={dropdownVisible ? "chevron-up" : "chevron-down"}
                size={20}
                color="#0a7ea4"
              />
            </TouchableOpacity>

            {dropdownStatusFilter !== 'all' && (
              <TouchableOpacity
                style={styles.resetFilterButton}
                onPress={() => handleDropdownStatusChange('all')}
              >
                <Ionicons name="close" size={16} color="#0a7ea4" />
                <Text style={styles.resetFilterButtonText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          {dropdownVisible && (
            <View style={styles.dropdownMenu}>
              {[
                { key: 'all', label: 'All Statuses' },
                { key: 'pending', label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.dropdownItem,
                    dropdownStatusFilter === item.key && styles.dropdownItemActive
                  ]}
                  onPress={() => handleDropdownStatusChange(item.key as any)}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    dropdownStatusFilter === item.key && styles.dropdownItemTextActive
                  ]}>
                    {item.label}
                  </Text>
                  {dropdownStatusFilter === item.key && (
                    <Ionicons name="checkmark" size={16} color="#0a7ea4" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.paginationButton, pagination.page <= 1 && styles.paginationButtonDisabled]}
            onPress={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            <Ionicons name="chevron-back" size={16} color={pagination.page <= 1 ? "#ccc" : "#0a7ea4"} />
          </TouchableOpacity>

          <View style={styles.pageNumbersContainer}>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <TouchableOpacity
                key={pageNum}
                style={[
                  styles.pageNumberButton,
                  pagination.page === pageNum && styles.pageNumberButtonActive
                ]}
                onPress={() => handlePageChange(pageNum)}
              >
                <Text style={[
                  styles.pageNumberText,
                  pagination.page === pageNum && styles.pageNumberTextActive
                ]}>
                  {pageNum}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.paginationButton, pagination.page >= pagination.totalPages && styles.paginationButtonDisabled]}
            onPress={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            <Ionicons name="chevron-forward" size={16} color={pagination.page >= pagination.totalPages ? "#ccc" : "#0a7ea4"} />
          </TouchableOpacity>
        </View>
      )}

      {/* Active Filter Indicator */}
      {statusFilter !== 'all' && (
        <View style={styles.activeFilterContainer}>
          <Text style={styles.activeFilterText}>
            Showing: {statusFilter === 'active' ? 'Active' :
                     statusFilter === 'completed' ? 'Completed' :
                     statusFilter === 'pending' ? 'Pending' :
                     statusFilter === 'canceled' ? 'Canceled' :
                     'All'} Reservations
          </Text>
          <TouchableOpacity onPress={clearStatusFilter} style={styles.clearFilterButton}>
            <Ionicons name="close" size={16} color="#0a7ea4" />
            <Text style={styles.clearFilterText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Active Tab Button */}
      {showActiveButton && statusFilter === 'active' && (
        <View style={styles.activeButtonContainer}>
          <TouchableOpacity
            style={styles.activeButton}
            onPress={() => {
              // Handle QR code scan here
              console.log('Scan QR Code button pressed!');
            }}
          >
            <Ionicons name="qr-code" size={20} color="#fff" />
            <Text style={styles.activeButtonText}>Scan QR Code</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}  edges={['right', 'bottom', 'left']}>
      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading reservations...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              const statusToUse = statusFilter === 'all' ? dropdownStatusFilter : statusFilter;
              dispatch(fetchReservations({ page: 1, limit: 20, status: statusToUse }));
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* API Response JSON Debug Toggle */}
      {/* {!loading && !error && reservations.length > 0 && (
        <View style={{ padding: 10, margin: 10 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#007AFF', padding: 8, borderRadius: 4, alignSelf: 'flex-start' }}
            onPress={() => setShowApiJson(!showApiJson)}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {showApiJson ? 'Hide' : 'Show'} API JSON Response
            </Text>
          </TouchableOpacity>

          {showApiJson && (
            <View style={{ backgroundColor: '#f8f9fa', marginTop: 10, borderRadius: 8, padding: 10, maxHeight: 300 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Processed Reservations Data:</Text>
              <ScrollView style={{ maxHeight: 250 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 12, color: '#333' }}>
              {JSON.stringify({
                reservations: reservationsState.reservations,
                pagination: reservationsState.pagination,
                loading: reservationsState.loading,
                error: reservationsState.error
              }, null, 2)}
            </Text>
              </ScrollView>
            </View>
          )}
        </View>
      )} */}

      {/* Reservation List */}
      {!error && (
        <ReservationList
          reservations={reservations}
          statusFilter={statusFilter}
          headerComponent={headerContent}
        />
      )}
    </SafeAreaView>
  );
}
