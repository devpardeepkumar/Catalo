import { onboardingApi } from '@/services/api/onboardingApi';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ReadyToCompleteScreen() {
   const handleCompleteOnboarding = async () => {
    try {
      await onboardingApi.completeOnboarding();
      alert('Onboarding completed successfully');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ready to complete</Text>
      <Text style={styles.subtitle}>
        You've completed the required steps. Click below to finalize onboarding.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleCompleteOnboarding}>
        <Text style={styles.buttonText}>Complete Onboarding</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ECF0F1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#34495E',
  },
  button: {
    backgroundColor: '#34495E',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});