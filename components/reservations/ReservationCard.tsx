import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/components/reservations/ReservationCard';
import { Reservation } from '../../types/reservation';

interface ReservationCardProps {
  reservation: Reservation;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [hasNotified, setHasNotified] = useState<boolean>(false);

  const TIMER_DURATION = 45 * 60; // 45 minutes in seconds

  useEffect(() => {
    const updateTimer = () => {
      if (reservation.status === 'requested' || reservation.status === 'open') {
        // Calculate remaining time from creation time + 45 minutes
        const startTime = reservation.createdAt.getTime();
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, TIMER_DURATION - elapsed);

        setTimeRemaining(remaining);

        // Show notification when timer expires (>45 minutes)
        if (remaining === 0 && !hasNotified) {
          setHasNotified(true);
          Alert.alert(
            'Reservation Timer Expired',
            `The 45-minute timer for reservation ${reservation.reservationCode} has expired.`,
            [{ text: 'OK' }]
          );
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [reservation.createdAt, reservation.status, hasNotified]);

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return 'Expired';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (): string => {
    if (reservation.status === 'collected') return '#28A745';
    if (reservation.status === 'cancelled' || reservation.status === 'expired') return '#DC3545';

    // 45-minute timer color progression
    const totalTime = 45 * 60; // 45 minutes in seconds
    const timeElapsed = totalTime - timeRemaining;

    if (timeElapsed >= totalTime) return '#DC3545'; // Red - Timer expired
    if (timeElapsed >= totalTime * 0.67) return '#FFC107'; // Yellow - Last 15 minutes (67% of 45min)
    return '#28A745'; // Green - First 30 minutes
  };

  const getStatusIcon = (): string => {
    if (reservation.status === 'collected') return 'checkmark-circle';
    if (reservation.status === 'cancelled') return 'close-circle';
    if (reservation.status === 'expired') return 'time';

    // 45-minute timer icon based on color
    const totalTime = 45 * 60; // 45 minutes in seconds
    const timeElapsed = totalTime - timeRemaining;

    if (timeElapsed >= totalTime) return 'alert-circle'; // Red - Expired
    if (timeElapsed >= totalTime * 0.67) return 'warning'; // Yellow - Last 15 minutes
    return 'time'; // Green - First 30 minutes
  };

  const getTimerProgress = (): number => {
    const totalTime = 45 * 60; // 45 minutes in seconds
    const timeElapsed = totalTime - timeRemaining;
    return Math.min(1, Math.max(0, timeElapsed / totalTime));
  };

  const handleConfirm = () => {
    Alert.alert(
      'Confirm Reservation',
      `Confirm all products for ${reservation.customerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // In real app, this would call an API or update context
            Alert.alert('Success', 'Reservation confirmed! QR code generated.');
          }
        }
      ]
    );
  };

  const handleViewDetails = () => {
    Alert.alert(
      'Reservation Details',
      `Customer: ${reservation.customerName}\nCode: ${reservation.customerCode}\nItems: ${reservation.products.length}\nTotal: €${reservation.totalValue}`,
      [{ text: 'OK' }]
    );
  };

  const confirmedCount = reservation.products.filter(p => p.status === 'confirmed').length;
  const totalCount = reservation.products.length;

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: getStatusColor() }]}
      onPress={handleViewDetails}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name={getStatusIcon() as any} size={20} color={getStatusColor()} />
          <Text style={[styles.title, { color: getStatusColor() }]}>
            {reservation.reservationCode}
          </Text>
          <Text style={styles.customerName}>{reservation.customerName}</Text>
        </View>

        {(reservation.status === 'requested' || reservation.status === 'open') && (
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={16} color="#7F8C8D" />
            <Text style={[styles.timer, { color: getStatusColor() }]}>
              {formatTime(timeRemaining)}
            </Text>
            <View style={styles.timerProgressBar}>
              <View
                style={[
                  styles.timerProgressFill,
                  {
                    width: `${(1 - getTimerProgress()) * 100}%`,
                    backgroundColor: getStatusColor()
                  }
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* Products Summary */}
      <View style={styles.productsContainer}>
        <Text style={styles.productsText}>
           {totalCount} item{totalCount !== 1 ? 's' : ''}
          {confirmedCount > 0 && ` • ${confirmedCount} confirmed`}
        </Text>
        <Text style={styles.valueText}>€{reservation.totalValue}</Text>
      </View>

      {/* Product List Preview */}
      <View style={styles.itemsPreview}>
        {reservation.products.slice(0, 2).map((product, index) => (
          <View key={product.id} style={styles.itemRow}>
            <Text style={styles.itemName} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.itemQuantity}>x{product.requestedQuantity}</Text>
          </View>
        ))}
        {reservation.products.length > 2 && (
          <Text style={styles.moreItems}>
            +{reservation.products.length - 2} more items
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      {(reservation.status === 'requested' || reservation.status === 'open') && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleConfirm}
          >
            <Text style={styles.primaryButtonText}>
              {reservation.status === 'requested' ? 'Review & Confirm' : 'Confirm Products'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleViewDetails}
          >
            <Text style={styles.secondaryButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Status Footer */}
      {reservation.status === 'collected' && (
        <View style={styles.statusFooter}>
          <Ionicons name="checkmark-circle" size={16} color="#28A745" />
          <Text style={styles.statusText}>Collected • {reservation.collectedAt?.toLocaleDateString()}</Text>
        </View>
      )}

      {(reservation.status === 'cancelled' || reservation.status === 'expired') && (
        <View style={styles.statusFooter}>
          <Ionicons name="close-circle" size={16} color="#DC3545" />
          <Text style={styles.statusText}>
            {reservation.status === 'cancelled' ? 'Cancelled' : 'Expired'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
