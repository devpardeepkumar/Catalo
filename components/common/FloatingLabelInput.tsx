import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: object;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  error,
  onFocus,
  onBlur,
  containerStyle,
  style,
  secureTextEntry,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const animatedLabelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;
  const animatedBorderColor = useRef(new Animated.Value(0)).current;

  const isActive = isFocused || !!value;
  const isPasswordField = secureTextEntry === true;

  useEffect(() => {
    // Animate label position
    Animated.timing(animatedLabelPosition, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isActive, animatedLabelPosition]);

  useEffect(() => {
    // Animate border color on focus
    Animated.timing(animatedBorderColor, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, animatedBorderColor]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Calculate label position
  const labelTop = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [Platform.OS === 'ios' ? 16 : 14, -8],
  });

  const labelLeft = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const labelFontSize = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  // Border color animation
  const borderColor = animatedBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? '#E74C3C' : '#BDC3C7',
      error ? '#E74C3C' : '#3498DB',
    ],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor,
          },
          error && styles.inputContainerError,
        ]}
      >
        <Animated.Text
          style={[
            styles.label,
            {
              top: labelTop,
              left: labelLeft,
              fontSize: labelFontSize,
              color: isFocused
                ? error
                  ? '#E74C3C'
                  : '#3498DB'
                : error
                ? '#E74C3C'
                : '#7F8C8D',
            },
          ]}
          pointerEvents="none"
        >
          {label}
        </Animated.Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, style, isPasswordField && styles.inputWithIcon]}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isActive ? '' : rest.placeholder}
            placeholderTextColor="#95A5A6"
            autoCorrect={false}
            secureTextEntry={isPasswordField && !showPassword}
            {...(rest as any)}
          />
          {isPasswordField && (
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPassword ?  'eye-outline' :'eye-off-outline'}
                size={22}
                color={isFocused ? (error ? '#E74C3C' : '#3498DB') : '#7F8C8D'}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputContainer: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 14,
    paddingBottom: Platform.OS === 'ios' ? 16 : 14,
    minHeight: 56,
    justifyContent: 'center',
  },
  inputContainerError: {
    borderColor: '#E74C3C',
  },
  label: {
    position: 'absolute',
    fontWeight: '500',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    fontSize: 16,
    color: '#2C3E50',
    padding: 0,
    margin: 0,
    flex: 1,
    ...Platform.select({
      ios: {
        paddingTop: 2,
      },
      android: {
        paddingTop: 0,
      },
    }),
  },
  inputWithIcon: {
    paddingRight: 4,
  },
  eyeIcon: {
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default FloatingLabelInput;

