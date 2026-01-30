import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import reservationsReducer from './slices/reservationsSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    reservations: reservationsReducer,
    // Add other slices here as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
