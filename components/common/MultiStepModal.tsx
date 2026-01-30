import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/styles/components/EditStoreProfileModal';

export interface StepConfig {
  id: string;
  title: string;
  content: React.ReactNode;
  validation?: () => Promise<boolean> | boolean;
  onNext?: () => Promise<void> | void;
}

export interface MultiStepModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => Promise<void> | void;
  steps: StepConfig[];
  title: string;
  loading?: boolean;
  saveButtonText?: string;
  showResetButton?: boolean;
  onReset?: () => void;
}

export const MultiStepModal: React.FC<MultiStepModalProps> = ({
  visible,
  onClose,
  onSave,
  steps,
  title,
  loading = false,
  saveButtonText = 'Save Changes',
  showResetButton = true,
  onReset,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];

  const handleNext = async () => {
    // Validate current step if validation function exists
    if (currentStep.validation) {
      const isValid = await currentStep.validation();
      if (!isValid) {
        return;
      }
    }

    // Execute onNext callback if provided
    if (currentStep.onNext) {
      await currentStep.onNext();
    }

    // Move to next step
    setCurrentStepIndex(prev => Math.min(prev + 1, totalSteps - 1));
  };

  const handlePrevious = () => {
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  };

  const handleSave = async () => {
    // Validate final step if validation function exists
    if (currentStep.validation) {
      const isValid = await currentStep.validation();
      if (!isValid) {
        return;
      }
    }

    await onSave();
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
    setCurrentStepIndex(0);
  };

  const handleClose = () => {
    setCurrentStepIndex(0);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.backButton}>
            <Ionicons name="close" size={24} color="#34495E" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
          {showResetButton && (
            <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.stepIndicator}>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.stepContainer}>
              <View
                style={[
                  styles.stepCircle,
                  currentStepIndex >= index && styles.stepCircleActive,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    currentStepIndex >= index && styles.stepNumberActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              {index < totalSteps - 1 && <View style={styles.stepLine} />}
            </View>
          ))}
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {currentStep.content}
        </ScrollView>

        <View style={styles.footer}>
          {currentStepIndex > 0 && (
            <TouchableOpacity
              onPress={handlePrevious}
              style={[styles.button, styles.previousButton]}
            >
              <Ionicons name="arrow-back" size={16} color="#34495E" />
              <Text style={styles.previousButtonText}>Previous</Text>
            </TouchableOpacity>
          )}

          {currentStepIndex < totalSteps - 1 ? (
            <TouchableOpacity
              onPress={handleNext}
              style={[styles.button, styles.nextButton]}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.button, styles.saveButton, loading && styles.disabledButton]}
              disabled={loading}
            >
              <Text style={[styles.saveButtonText, loading && styles.disabledText]}>
                {loading ? 'Saving...' : saveButtonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};
