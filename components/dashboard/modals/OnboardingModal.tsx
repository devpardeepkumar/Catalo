import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface OnboardingModalProps {
  visible: boolean;
  onStartOnboarding: () => void;
  onSkipOnboarding: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onStartOnboarding,
  onSkipOnboarding,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onSkipOnboarding}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Ionicons name="storefront-outline" size={60} color="#34495E" style={styles.modalIcon} />
          <Text style={styles.modalTitle}>Welcome to Your Dashboard!</Text>
          <Text style={styles.modalMessage}>
            To get started and showcase your products effectively, please complete your store setup by going through our onboarding process.
          </Text>
          <TouchableOpacity style={styles.onboardingButton} onPress={onStartOnboarding}>
            <Text style={styles.onboardingButtonText}>Start Onboarding</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={onSkipOnboarding}>
            <Text style={styles.skipButtonText}>Skip for Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%' as const,
    maxWidth: 400,
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#34495E',
    textAlign: 'center' as const,
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center' as const,
    lineHeight: 24,
    marginBottom: 30,
  },
  onboardingButton: {
    backgroundColor: '#34495E',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%' as const,
    alignItems: 'center' as const,
    marginBottom: 15,
  },
  onboardingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: '#7F8C8D',
    fontSize: 14,
  },
};
