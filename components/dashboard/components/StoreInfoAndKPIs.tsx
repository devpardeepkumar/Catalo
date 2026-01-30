import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface StoreInfoAndKPIsProps {
  storeName: string;
  storeLogo: string;
  storeStatus: string;
  vacationMode: boolean;

}

export const StoreInfoAndKPIs: React.FC<StoreInfoAndKPIsProps> = ({
  storeName,
  storeLogo,
  storeStatus,
  vacationMode,
 
}) => {
  return (
    <View style={styles.topArea}>
      <View style={styles.storeInfo}>
        <Image source={{ uri: storeLogo }} style={styles.storeLogo} />
        <View>
          <Text style={styles.storeNameText}>{storeName}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.storeStatusText}>
              <Ionicons
                name={storeStatus === 'Open' ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={storeStatus === 'Open' ? '#28A745' : '#DC3545'}
              /> {storeStatus}
            </Text>
            <Text style={styles.vacationModeText}>
              <Ionicons
                name={vacationMode ? 'airplane' : 'leaf'}
                size={16}
                color={vacationMode ? '#FFC107' : '#6C757D'}
              /> Vacation: {vacationMode ? 'ON' : 'OFF'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = {
  topArea: {
    backgroundColor: '#34495E',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  storeInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  //  marginBottom: 15,
  },
  storeLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  storeNameText: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row' as const,
    marginTop: 5,
  },
  storeStatusText: {
    fontSize: 14,
    color: '#fff',
    marginRight: 15,
  },
  vacationModeText: {
    fontSize: 14,
    color: '#fff',
  },
};
