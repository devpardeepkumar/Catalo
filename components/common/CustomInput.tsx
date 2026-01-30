// import { CustomInputProps } from '@/types/componentsType';
// import React from 'react';
// import { Text, TextInput, View, StyleSheet } from 'react-native';

// export const CustomInput: React.FC<CustomInputProps> = ({
//   label,
//   value,
//   onChangeText,
//   placeholder,
//   secureTextEntry = false,
//   keyboardType = 'default',
//   error,
// }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         style={[styles.input, error ? styles.inputError : null]}
//         value={value}
//         onChangeText={onChangeText}
//         placeholder={placeholder}
//         secureTextEntry={secureTextEntry}
//         keyboardType={keyboardType}
//         autoCapitalize="none"
//       />
//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { marginBottom: 8 },
//   label: { fontSize: 16, marginBottom: 5, fontWeight: '500' },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     backgroundColor: '#fff',
//   },
//   inputError: { borderColor: '#d32f2f' },
//   errorText: { color: '#d32f2f', fontSize: 14, marginTop: 4 },
// });
// src/components/CustomInput.tsx
import React from 'react';
import {
  Platform, StyleSheet, Text,
  TextInput,
  TextInputProps, View
} from 'react-native';


interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  multiline?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style,
  ...rest
}) => {
  return (
    <View style={customInputStyles.container}>
      {label && <Text style={customInputStyles.label}>{label}</Text>}

      <TextInput
        style={[
          customInputStyles.input,
          multiline && customInputStyles.multilineInput,
          error && customInputStyles.inputError,
          style,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#95A5A6"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />

      {error && <Text style={customInputStyles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomInput;

const customInputStyles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: Platform.OS === 'ios' ? 14 : 12,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  multilineInput: {
    paddingTop: 16,
    minHeight: 100,
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
});