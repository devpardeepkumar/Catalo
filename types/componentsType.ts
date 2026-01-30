//common cutome input component interface

export interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  error?: string;
}


// common custom button type
export interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}


//Edit store profile Modal
export interface EditStoreProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export interface BusinessHours {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface HolidayDate {
  id: string;
  date: Date;
  reason: string;
}

// dashboard section retailer Stats
export interface RetailerStatsprops {
  featuredCount: number;
  inStockCount: number;
  pendingCount: number;
  totalProducts: number;
  unmatchedCount: number;
}

//Dashboard section KPICard interface 
 export interface KPICardsProps {
  totalViews: string;
  bookings: string;
  conversion: string;
}


