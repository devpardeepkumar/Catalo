export interface ProductMatch {
  id: string;
  name: string;
  brand: string;
  manufacturerName: string;
  image: string;
  specs: Record<string, string>;
  category: string;
  description: string;
}

export interface ManualProductForm {
  ean: string;
  manufacturerCode: string;
  brand: string;
  productName: string;
  internalCode: string;
  quantity: string;
  price: string;
  discount: string;
  discountDuration: string;
  description: string;
  image: string;
}

export interface ProductSheet {
  id: string;
  name: string;
  brand: string;
  images: string[];
  description: string;
  category: string;
  specs: Record<string, string>;
  manufacturerName: string;
}

export type ManualEntryStep = 'initial' | 'confirmation';

export interface ManualProductState {
  step: ManualEntryStep;
  form: ManualProductForm;
  matches: ProductMatch[];
  productSheet: ProductSheet | null;
  isLoading: boolean;
  error: string | null;
  searchCompleted: boolean;
}
