import { RetailerStatsprops } from '@/types/componentsType';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { analyticsApi } from '../../../services/api/analyticsApi';
import { styles } from '../styles/DashboardSections.styles';

export const RetailerStats: React.FC = () => {
  const [statsData, setStatsData] = useState<RetailerStatsprops | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);

  const defaultStats: RetailerStatsprops = {
    featuredCount: 0,
    inStockCount: 0,
    pendingCount: 0,
    totalProducts: 0,
    unmatchedCount: 0,
  };

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        const stats = await analyticsApi.getStats();
        setStatsData(stats?.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <View style={styles.section}>
      {/* <Text style={styles.sectionTitle}> Statistics</Text> */}
      {isLoadingStats ? (
        <View style={styles.card}>
          <Text style={styles.cardValue}>Loading stats...</Text>
        </View>
      ) : (
        <View>
          <View style={styles.totalProductsRow}>
            <Text style={styles.totalProductsLabel}>Total Products</Text>
            <Text style={styles.totalProductsValue}>{statsData?.totalProducts || defaultStats.totalProducts}</Text>
          </View>
          <View style={styles.statsGrid}>
            {Object.entries(statsData || defaultStats)
              .filter(([key]) => key !== 'totalProducts')
              .map(([key, value]) => (
                <View key={key} style={styles.statCard}>
                  <Text style={styles.statLabel}>{key}</Text>
                  <Text style={styles.statValue}>{value}</Text>
                </View>
              ))}
          </View>
        </View>
      )}

    </View>
  );
};
