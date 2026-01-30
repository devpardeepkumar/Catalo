export interface ReservationProduct {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  requestedQuantity: number;
  confirmedQuantity: number;
  collectedQuantity: number;
  status: 'pending' | 'confirmed' | 'collected' | 'removed';
  confirmedAt?: Date;
  collectedAt?: Date;
}

export type ReservationStatus =
  | 'pending'      // Customer requested, not viewed by retailer
  | 'open'          // Retailer viewed, can confirm products
  | 'confirmed'     // All products confirmed, ready for pickup
  | 'partially_collected' // Some products collected
  | 'collected'     // All products collected
  | 'expired'       // Not confirmed within 45 minutes
  | 'cancelled';    // Cancelled by retailer or customer

export interface Reservation {
  id: string;
  customerId: string;
  customerCode: string; // For confidentiality (e.g., "CUST-789")
  customerName: string; // For display purposes
  storeId: string;
  status: ReservationStatus;
  products: ReservationProduct[];
  qrCode: string;
  reservationCode: string; // Human-readable code (e.g., "RSV-123456789")
  createdAt: Date;
  expiresAt: Date; // 45 minutes from creation
  pickupDeadline: Date; // Usually 48 hours from confirmation
  confirmedAt?: Date;
  collectedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  totalValue: number;
}

export interface ReservationNotification {
  id: string;
  reservationId: string;
  type: 'confirmation_deadline' | 'expiry_warning' | 'cancellation';
  message: string;
  sentAt: Date;
  readAt?: Date;
}

export interface ReservationStats {
  totalRequests: number;
  urgentRequests: number; // < 15 minutes
  expiringSoon: number; // < 30 minutes
  completedToday: number;
  cancelledToday: number;
  revenuePotential: number;
}
