import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { gdprApi } from '../../services/api/gdprApi';

interface PrivacyGDPRSectionProps {
  onExportData?: () => void;
  onCookieConsent?: (action: 'allow' | 'deny') => void;
  onDeleteAccount?: () => void;
}

export const PrivacyGDPRSection: React.FC<PrivacyGDPRSectionProps> = ({
  onExportData,
  onCookieConsent,
  onDeleteAccount,
}) => {
  const router = useRouter();
  const { setUser } = useUser();
  const { showToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleExportData = async () => {
    if (onExportData) {
      onExportData();
      return;
    }

    try {
      Alert.alert('Export Data', 'Preparing your data for download...', [{ text: 'OK' }]);
      const response = await gdprApi.exportData();

      if (response.success && response.data) {

        Alert.alert(
          'Export Successful',
          'Your data has been exported successfully.',
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(response.message || 'Export failed');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to export data. Please try again.';
      Alert.alert(
        'Export Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    }
  };

  const handleCookieConsent = async (action: 'allow' | 'deny') => {
    try {
      const granted = action === 'allow' ? true : false;
      const payload = {
        policyVersion: '1.0',
        granted: granted,
      };
      const response = await gdprApi.cookieConsent(payload);

      if (response.success) {
        // showToast('success', response.message || 'Cookie consent updated successfully');
        alert(response.message || 'Cookie consent updated successfully')
      } else {
        throw new Error(response.message || 'Failed to update cookie consent');
      }
    } catch (error: any) {
      // showToast('error', error.message || 'Failed to update cookie consent. Please try again.');
      alert(error.message || 'Failed to update cookie consent. Please try again.');

    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const executeDeleteAccount = async () => {
    try {
      const response = await gdprApi.deleteAccount();
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete account');
      }
      router.push('/auth/Login' as any);
      await AsyncStorage.removeItem('authToken');

    } catch (error: any) {
      alert(error.message || 'Failed to delete account. Please try again.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <View style={styles.privacySection}>
        <View style={styles.privacyHeader}>
          <Ionicons name="shield-checkmark" size={20} color="#34495E" />
          <Text style={styles.privacyTitle}>Privacy & GDPR</Text>
        </View>

        {/* Export My Data */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyCardContent}>
            <View style={styles.privacyCardLeft}>
              <Text style={styles.privacyCardTitle}>Export my data</Text>
              <Text style={styles.privacyCardDescription}>
                Download a copy of all your personal data and account information
              </Text>
            </View>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={handleExportData}
            >
              <Ionicons name="download-outline" size={16} color="#fff" />
              <Text style={styles.exportButtonText}>Export</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cookie Consent */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyCardContent}>
            <View style={styles.privacyCardLeft}>
              <Text style={styles.privacyCardTitle}>Cookie consent</Text>
              <Text style={styles.privacyCardDescription}>
                Manage your cookie preferences and data tracking settings
              </Text>
            </View>
            <View style={styles.cookieButtons}>
              <TouchableOpacity
                style={styles.allowButton}
                onPress={() => handleCookieConsent('allow')}
              >
                <Text style={styles.allowButtonText}>Allow</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.denyButton}
                onPress={() => handleCookieConsent('deny')}
              >
                <Text style={styles.denyButtonText}>Deny</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Delete My Account */}
        <View style={styles.deleteAccountCard}>
          <View style={styles.privacyCardContent}>
            <View style={styles.privacyCardLeft}>
              <Text style={styles.deleteAccountTitle}>Delete my account</Text>
              <Text style={styles.privacyCardDescription}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
            >
              <Ionicons name="trash-outline" size={16} color="#fff" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <Pressable
          style={styles.centeredView}
          onPress={() => setShowDeleteModal(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Confirm Account Deletion</Text>
            <Text style={styles.modalText}>
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonCancel]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonDelete]}
                onPress={executeDeleteAccount}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Privacy & GDPR Styles
  privacySection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 8,
  },
  privacyCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  privacyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  privacyCardLeft: {
    flex: 1,
    marginRight: 12,
  },
  privacyCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 4,
  },
  privacyCardDescription: {
    fontSize: 14,
    color: '#5D6D7E',
    lineHeight: 18,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34495E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  cookieButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  allowButton: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  allowButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  denyButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  denyButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteAccountCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  deleteAccountTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C53030',
    marginBottom: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53E3E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: '#ccc',
  },
  buttonDelete: {
    backgroundColor: '#E53E3E',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
