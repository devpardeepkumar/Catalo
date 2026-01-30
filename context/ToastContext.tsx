import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = Date.now().toString();
    const toast: Toast = { id, type, message, duration };

    setToasts(prev => [...prev, toast]);

    // Auto-hide after duration
    setTimeout(() => {
      hideToast(id);
    }, duration);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const getToastStyle = (type: ToastType) => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#10B981', borderLeftColor: '#059669' };
      case 'error':
        return { backgroundColor: '#EF4444', borderLeftColor: '#DC2626' };
      case 'warning':
        return { backgroundColor: '#F59E0B', borderLeftColor: '#D97706' };
      case 'info':
      default:
        return { backgroundColor: '#3B82F6', borderLeftColor: '#2563EB' };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <View style={styles.container}>
        {toasts.map(toast => (
          <Animated.View
            key={toast.id}
            style={[
              styles.toast,
              getToastStyle(toast.type)
            ]}
          >
            <Text style={styles.message}>{toast.message}</Text>
          </Animated.View>
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60, // Account for status bar
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  toast: {
    borderRadius: 8,
    borderLeftWidth: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 50,
    justifyContent: 'center',
  },
  message: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
