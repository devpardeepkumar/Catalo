export type NotificationType = 'all' | 'requests' | 'alerts';

export interface Notification {
  id: string;
  type: 'new' | 'product_alert' | 'warning' | 'cancellation' | 'urgent_reservation';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  category: NotificationType;
  actions?: {
    primary?: {
      label: string;
      onPress: () => void;
    };
    secondary?: {
      label: string;
      onPress: () => void;
    };
  };
  metadata?: {
    reservationId?: string;
    productId?: string;
    timeLeft?: number; // in minutes for urgent reservations
  };
}
