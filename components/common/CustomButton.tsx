import { CustomButtonProps } from '@/types/componentsType';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text style={styles.text}>{loading ? 'Submitting...' : title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#34495E',
    padding:  Platform.OS === "ios" ? 16 : 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabled: { backgroundColor: '#aaa' },
  text: { color: '#fff', fontSize:  Platform.OS === "ios" ? 18 : 16, fontWeight: 'bold' },
});