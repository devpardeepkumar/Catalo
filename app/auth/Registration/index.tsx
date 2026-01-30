import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// import { CustomPicker } from '../components/CustomPicker';
// import { CustomSwitch } from '../components/CustomSwitch';
import { CustomButton } from '@/components/common/CustomButton';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError, registerUser, resetRegistrationSuccess } from '@/store/slices/authSlice';
import { DocumentFile, RegistrationFormData } from '@/types/authType';
import { registrationSchema } from '@/validation/authValidation';
import { useNavigation } from '@react-navigation/native';

import styles from './registration.styles';

const initialValues: RegistrationFormData = {
  companyName: 'Tech Solutions SRL',
  registeredOffice: 'Via Roma 123, Milano,',
  firstName: 'Rossi',
  lastName: 'tes',
  gender: '',
  dateOfBirth: '',
  vatNumber: '01234567897',
  taxCode: '',
  sdiCode: 'ABC1234',
  rea: 'MI123456',
  pecEmail: 'Test@pec.it',
  email: 'Test@yopmail.com',
  password: 'Test@12345678',
  confirmPassword: 'Test@12345678',
  role: 'retailer',
  acceptTerms: true,
  acceptPrivacy: true,
};

export default function Registration() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { loading, error, registrationSuccess } = useAppSelector(state => state.auth);

  const [document, setDocument] = useState<DocumentFile | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!result.canceled) {
        setDocument(result.assets[0]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  // Handle registration success
  useEffect(() => {
    if (registrationSuccess) {
      // Save registration data for login use
      const saveRegistrationData = async () => {
        try {
          const registrationData = {
            email: '', // Will be set from form values when registration succeeds
            role: 'retailer',
          };
          await AsyncStorage.setItem('registrationData', JSON.stringify(registrationData));
        } catch (error) {
          console.error('Error saving registration data:', error);
        }
      };

      saveRegistrationData();

      Alert.alert(
        'Registration Successful!',
        'Please login with your credentials.',
        [
          {
            text: 'Login',
            onPress: () => {
              dispatch(resetRegistrationSuccess());
              navigation.navigate('auth/Login/index' as never);
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [registrationSuccess, dispatch, navigation]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (
    values: RegistrationFormData,
    actions: FormikHelpers<RegistrationFormData>
  ) => {
    try {
      await dispatch(registerUser(values)).unwrap();
      actions.setSubmitting(false);
    } catch (error) {
      actions.setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Registration</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={contentHeight > scrollViewHeight}
        alwaysBounceVertical={false}
        scrollEnabled={contentHeight > scrollViewHeight || Platform.OS !== "ios"}
        onContentSizeChange={(contentWidth, contentHeight) => {
          setContentHeight(contentHeight);
        }}
        onLayout={(event) => {
          setScrollViewHeight(event.nativeEvent.layout.height);
        }}
      >
      

      <Formik
        initialValues={initialValues}
        validationSchema={registrationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          setFieldValue,
          isSubmitting,
          handleSubmit,
        }:any) => (
          <>
            <FloatingLabelInput
              label="Company Name"
              value={values.companyName}
              onChangeText={handleChange('companyName')}
              onBlur={handleBlur('companyName')}
              placeholder="Enter company name"
              error={touched.companyName && errors.companyName ? String(errors.companyName) : undefined}
            />

            <FloatingLabelInput
              label="Registered Office Address"
              value={values.registeredOffice}
              onChangeText={handleChange('registeredOffice')}
              onBlur={handleBlur('registeredOffice')}
              placeholder="Enter registered office address"
              error={touched.registeredOffice && errors.registeredOffice ? String(errors.registeredOffice) : undefined}
            />

            <FloatingLabelInput
              label="First Name (Legal Rep)"
              value={values.firstName}
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              placeholder="Enter first name"
              error={touched.firstName && errors.firstName ? String(errors.firstName) : undefined}
            />

            <FloatingLabelInput
              label="Last Name (Legal Rep)"
              value={values.lastName}
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              placeholder="Enter last name"
              error={touched.lastName && errors.lastName ? String(errors.lastName) : undefined}
            />

            {/* Gender Selection */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Gender</Text>
              <View style={styles.genderOptions}>
                {[
                  { label: 'Male', value: 'M' },
                  { label: 'Female', value: 'F' },
                  { label: 'Other', value: 'O' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.genderOption,
                      values.gender === option.value && styles.genderOptionSelected
                    ]}
                    onPress={() => setFieldValue('gender', option.value)}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      values.gender === option.value && styles.genderOptionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {touched.gender && errors.gender && (
                <Text style={styles.errorText}>{errors.gender}</Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[styles.dateButton, { marginBottom: 15 }]}
            >
              <Text>{values.dateOfBirth || 'Select Date of Birth'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={values.dateOfBirth ? new Date(values.dateOfBirth) : new Date()}
                mode="date"
                onChange={(event: any, date: any) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (date) setFieldValue('dateOfBirth', date.toISOString().split('T')[0]);
                }}
              />
            )}
            {touched.dateOfBirth && errors.dateOfBirth && (
              <Text style={[styles.errorText, { marginBottom: 15 }]}>{errors.dateOfBirth}</Text>
            )}

            <FloatingLabelInput
              label="VAT Number"
              value={values.vatNumber}
              onChangeText={handleChange('vatNumber')}
              onBlur={handleBlur('vatNumber')}
              placeholder="IT12345678901"
              error={touched.vatNumber && errors.vatNumber ? String(errors.vatNumber) : undefined}
            />

            <FloatingLabelInput
              label="Tax Code"
              value={values.taxCode}
              onChangeText={handleChange('taxCode')}
              onBlur={handleBlur('taxCode')}
              placeholder="Enter tax code"
            />

            <FloatingLabelInput
              label="SDI Code"
              value={values.sdiCode}
              onChangeText={handleChange('sdiCode')}
              onBlur={handleBlur('sdiCode')}
              placeholder="ABCDEF1"
              error={touched.sdiCode && errors.sdiCode ? String(errors.sdiCode) : undefined}
            />

            <FloatingLabelInput
              label="REA"
              value={values.rea}
              onChangeText={handleChange('rea')}
              onBlur={handleBlur('rea')}
              placeholder="Enter REA code"
            />

            <FloatingLabelInput
              label="Certified Email (PEC)"
              value={values.pecEmail}
              onChangeText={handleChange('pecEmail')}
              onBlur={handleBlur('pecEmail')}
              placeholder="Enter PEC email address"
              keyboardType="email-address"
              autoCapitalize="none"
              error={touched.pecEmail && errors.pecEmail ? String(errors.pecEmail) : undefined}
            />

            <FloatingLabelInput
              label="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
              error={touched.email && errors.email ? String(errors.email) : undefined}
            />

            <TouchableOpacity style={[styles.uploadButton, { marginBottom: 15 }]} onPress={pickDocument}>
              <Text>{document ? document.name : 'Select Document'}</Text>
            </TouchableOpacity>

            <FloatingLabelInput
              label="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              placeholder="Enter password"
              secureTextEntry
              error={touched.password && errors.password ? String(errors.password) : undefined}
            />

            <FloatingLabelInput
              label="Confirm Password"
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              placeholder="Re-enter password"
              secureTextEntry
              error={touched.confirmPassword && errors.confirmPassword ? String(errors.confirmPassword) : undefined}
            />

            {/* Terms and Privacy Switches */}
            <View style={styles.switchContainer}>
              <TouchableOpacity
                style={styles.switchRow}
                onPress={() => setFieldValue('acceptTerms', !values.acceptTerms)}
              >
                <View style={[styles.checkbox, values.acceptTerms && styles.checkboxChecked]}>
                  {values.acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.switchLabel}>I accept the Terms and Conditions</Text>
              </TouchableOpacity>
              {touched.acceptTerms && errors.acceptTerms && (
                <Text style={styles.errorText}>{errors.acceptTerms}</Text>
              )}
            </View>

            <View style={styles.switchContainer}>
              <TouchableOpacity
                style={styles.switchRow}
                onPress={() => setFieldValue('acceptPrivacy', !values.acceptPrivacy)}
              >
                <View style={[styles.checkbox, values.acceptPrivacy && styles.checkboxChecked]}>
                  {values.acceptPrivacy && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.switchLabel}>I accept the Privacy Policy</Text>
              </TouchableOpacity>
              {touched.acceptPrivacy && errors.acceptPrivacy && (
                <Text style={styles.errorText}>{errors.acceptPrivacy}</Text>
              )}
            </View>

            {/* <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By registering for our service, you accept our{' '}
                <Text style={[styles.termsText, styles.underlinedText]}>Terms and Conditions</Text>
                {' '}and{' '}
                <Text style={[styles.termsText, styles.underlinedText]}>Privacy Policy</Text>
                .
              </Text>
            </View> */}

            {/* Display API error messages */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <CustomButton
              title="Business Registration"
              onPress={handleSubmit}
              disabled={loading}
              loading={loading}
            />

            <TouchableOpacity
              style={styles.loginLinkContainer}
              onPress={() => navigation.navigate('auth/Login/index' as never)}
            >
              <Text style={styles.loginLinkText}>
                Already have an account? <Text style={styles.loginLink}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </>
        )}
        </Formik>
      </ScrollView>
    </View>
    <View style={styles.footer}>
        {/* Footer content can be added here */}
      </View>
    </KeyboardAvoidingView>
   
  );
}

