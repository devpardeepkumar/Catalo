import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
  error?: string;
  disabled?: boolean;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  label,
  error,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.switchRow}>
        <Text style={[styles.label, disabled && styles.disabledText]}>
          {label}
        </Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginRight: 12,
  },
  disabledText: {
    color: '#999',
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    marginTop: 4,
  },
});
