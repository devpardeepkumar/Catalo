import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/screens/notificationDetail';

export default function NotificationDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const getIcon = () => {
    switch (params.type) {
      case 'urgent_reservation':
        return '⏰';
      case 'new':
        return '●';
      case 'product_alert':
        return '📦';
      case 'warning':
        return '⚠️';
      case 'cancellation':
        return '❌';
      default:
        return '📱';
    }
  };

  const getTimeString = () => {
    if (params.timestamp) {
      const timestamp = new Date(params.timestamp as string);
      const now = new Date();
      const diff = now.getTime() - timestamp.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days} days ago`;
      if (hours > 0) return `${hours} hours ago`;
      if (minutes > 0) return `${minutes} minutes ago`;
      return 'Just now';
    }
    return '';
  };

  const getCategoryColor = () => {
    switch (params.category) {
      case 'requests':
        return '#0a7ea4';
      case 'alerts':
        return '#E74C3C';
      case 'history':
        return '#34495E';
      default:
        return '#34495E';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#34495E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.notificationCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{getIcon()}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{params.title}</Text>

            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
              <Text style={styles.categoryText}>
                {params.category?.toString().toUpperCase()}
              </Text>
            </View>

            <Text style={styles.timestamp}>{getTimeString()}</Text>

            <View style={styles.divider} />

            <Text style={styles.message}>{params.message}</Text>

            {params.type === 'urgent_reservation' && (
              <View style={styles.urgentContainer}>
                <Ionicons name="time-outline" size={20} color="#E74C3C" />
                <Text style={styles.urgentText}>This is an urgent reservation request requiring immediate attention</Text>
              </View>
            )}

            {params.type === 'product_alert' && (
              <View style={styles.alertContainer}>
                <Ionicons name="warning-outline" size={20} color="#E74C3C" />
                <Text style={styles.alertText}>Inventory action may be required</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryAction}>
            <Text style={styles.primaryActionText}>
              {params.type === 'urgent_reservation' ? 'View Reservation Details' :
               params.type === 'product_alert' ? 'Manage Inventory' :
               params.type === 'new' ? 'Take Action' : 'View Details'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction}>
            <Text style={styles.secondaryActionText}>Mark as Read</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
