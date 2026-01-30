import { KPICardsProps } from '@/types/componentsType';
import React from 'react';
import { Text, View } from 'react-native';

export const KPICards: React.FC<KPICardsProps> = ({
  totalViews,
  bookings,
  conversion,
}) => {
  return (
    <View style={styles.kpiContainer}>
      <View style={styles.kpiCard}>
        <Text style={styles.kpiTitle}>Total Views</Text>
        <Text style={styles.kpiValue}>{totalViews}</Text>
      </View>
      <View style={styles.kpiCard}>
        <Text style={styles.kpiTitle}>Bookings</Text>
        <Text style={styles.kpiValue}>{bookings}</Text>
      </View>
      <View style={styles.kpiCard}>
        <Text style={styles.kpiTitle}>Conversion</Text>
        <Text style={styles.kpiValue}>{conversion}</Text>
      </View>
    </View>
  );
};

const styles = {
  kpiContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
   // backgroundColor: '#34495E',
   // padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  kpiCard: {
    backgroundColor: '#34495E',
    alignItems: 'center' as const,
    padding: 10,
    //backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  kpiTitle: {
    fontSize: 12,
    color: '#E0E6ED',
    marginBottom: 5,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
};
