import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { analyticsApi } from '../../../services/api/analyticsApi';
import { styles } from '../styles/DashboardSections.styles';

export const AlertsSection: React.FC = () => {
  const [alertsData, setAlertsData] = useState<{message: string; type: string; createdAt: string}[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoadingAlerts(true);
      try {
        const alerts = await analyticsApi.getAlerts();
        const alertsResponse = alerts?.data || alerts;
        
        if (Array.isArray(alertsResponse)) {
          setAlertsData(alertsResponse);
        } else {
          const alertsArray = alertsResponse ? [alertsResponse] : [];
          setAlertsData(alertsArray);
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setIsLoadingAlerts(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Alerts & Suggestions</Text>
      {isLoadingAlerts ? (
        <View style={styles.card}>
          <Text style={styles.cardValue}>Loading...</Text>
        </View>
      ) : alertsData.length > 0 ? (
        alertsData.map((alert, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{alert.type}</Text>
            <Text style={styles.cardValue}>{alert.message}</Text>
          </View>
        ))
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardValue}>No data found</Text>
        </View>
      )}
    </View>
  );
};

