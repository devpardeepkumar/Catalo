import { CustomButton } from '@/components/common/CustomButton';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';
import { useUser } from '@/context/UserContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError, loginUser } from '@/store/slices/authSlice';
import { onboardingApi } from '@/services/api/onboardingApi';
import { loginSchema } from '@/validation/authValidation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Formik, FormikHelpers } from 'formik';
import { useEffect } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
// @ts-ignore - Suppress type error for missing declaration file
import styles from './login.styles';


interface LoginFormData {
  email: string;
  password: string;
}

const initialValues: LoginFormData = {
  email: 'retail121Nam@yopmail.com',
  password: 'Retail121Nam@yopmail.com',
  // email: 'mario1.rossi@yopmail.com',
  // password: 'SecurePass123!',
};

export default function Login() {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector((state: any) => state.auth);
  const { refreshUser } = useUser();

  // Handle successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      const storeAuthToken = async () => {
        try {
          if (user.data.tokens.accessToken) {

            await AsyncStorage.setItem('authToken', user.data.tokens.accessToken);
          }
        } catch (error) {
          console.error('Error storing auth token:', error);
        }
      };

      const handlePostLogin = async () => {
        try {
          // Store auth token
          await storeAuthToken();

          // Refresh user data from /auth/me API after successful login
          await refreshUser();

          // Get onboarding status
          const onboardingStatus = await onboardingApi.getOnboardingStatus();

          if (onboardingStatus.data.currentStep === 'completed') {
           
            router.replace('/(tabs)'); 
          } else {
           
            router.replace('/screens/onboarding/BusinessBrandBasicsScreen');
          }
        } catch (error) {
          console.error('Error during post-login process:', error);
          // Handle error, maybe navigate to a generic error screen or onboarding
          router.replace('/screens/onboarding/BusinessBrandBasicsScreen');
        }
      };

      handlePostLogin();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (
    values: LoginFormData,
    actions: FormikHelpers<LoginFormData>
  ) => {
    try {
      // Dispatch the loginUser action
      await dispatch(loginUser(values)).unwrap();

      // Success handling is done in useEffect above
      actions.setSubmitting(false);
    } catch (error) {
      console.error('Login error:', error);
      actions.setSubmitting(false);
      // Error is handled by Redux state, no need for additional Alert here
    }
  };

  return (
    <View style={styles.rootContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Around!</Text>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.subtitle}>The app where you can</Text>
        <Text style={styles.subtitle1}>find what you need</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* <View style={styles.mainContainer}>
        <Text style={styles.title}>Login</Text>
      </View> */}
        <View style={styles.container}>
          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              handleSubmit,
            }: any) => (
              <>
                <FloatingLabelInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={touched.email && errors.email ? String(errors.email) : undefined}
                />

                <FloatingLabelInput
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  placeholder="Enter your password"
                  secureTextEntry
                  error={touched.password && errors.password ? String(errors.password) : undefined}
                />

                {/* Display API error messages */}
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <View style={styles.forgotPasswordContainer}>
                  <Text
                    style={styles.forgotPasswordText}
                    onPress={() => router.push('/auth/ForgotPassword' as any)}
                  >
                    Forgotten password?
                  </Text>
                </View>

                <CustomButton
                  title="Login"
                  onPress={() => handleSubmit()}
                  disabled={loading}
                  loading={loading}
                />

                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Don't have an account? </Text>
                  <Text
                    style={styles.registerLink}
                    onPress={() => router.push('/auth/Registration')}
                  >
                    Register here
                  </Text>
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
}
