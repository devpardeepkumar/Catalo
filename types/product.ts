export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  brand?: string;
  quantity?: number;
  views?: number;
  clicks?: number;
  bookings?: number;
  ean?: string;
  manufacturerCode?: string;
  description?: string;
  internalCode?: string;
  discount?: number;
  discountDuration?: string;
}

// product detail screen interface

export interface ProductDetailsProps {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  brand?: string;
  quantity?: number;
  views?: number;
  clicks?: number;
  bookings?: number;
  ean?: string;
  description?: string;
  isGeolocated?: boolean;
  lastUpdated?: string;
}