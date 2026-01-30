import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { NotificationsProvider } from '../context/NotificationsContext';
import { ProductsProvider } from '../context/ProductsContext';
import { ToastProvider } from '../context/ToastContext';
import { UserProvider } from '../context/UserContext';
import { store } from '../store/store';

// export const unstable_settings = {
//   anchor: './auth/Registration/index.tsx',
// };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ToastProvider>
          <UserProvider>
            <ProductsProvider>
              <NotificationsProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                  <Stack>
                    {/* <Stack.Screen name="/" options={{ headerShown: false }} /> */}
                    {/* <Stack.Screen name='/auth/Registration' options={{ headerShown: false }}/> */}
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="auth/Registration/index" options={{ headerShown: false }}/>
                    <Stack.Screen name="auth/Login/index" options={{ headerShown: false }}/>
                    <Stack.Screen name="auth/ForgotPassword/index" options={{ headerShown: false }}/>
                    <Stack.Screen name="screens/onboarding/BusinessBrandBasicsScreen" options={{ headerShown: false }}/>
                    <Stack.Screen name="screens/onboarding/BusinessBrandLocationScreen" options={{ headerShown: false }}/>
                    <Stack.Screen name="screens/onboarding/BusinessBrandTimeScreen" options={{ headerShown: false }}/>
                    <Stack.Screen name="screens/onboarding/ReadyToCompleteScreen" options={{ headerShown: false }}/>
                    <Stack.Screen name="screens/ProductDetailsScreen" options={{ title: 'Product Details' }} />
                    <Stack.Screen name="screens/EditProductScreen" options={{ title: 'Edit Product' }} />
                    <Stack.Screen name="screens/UserDetailsScreen" options={{ title: 'User Details' }} />
                    <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                  </Stack>
                  <StatusBar style="auto" />
                </ThemeProvider>
              </NotificationsProvider>
            </ProductsProvider>
          </UserProvider>
        </ToastProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
