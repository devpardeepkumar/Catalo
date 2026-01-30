import { basicsSchema, locationSchema, editProfileSchema } from '@/validation/validationListSchemas';

export interface StoreBasicsData {
  storeName: string;
  storeEmail: string;
  phone: string;
  description: string;
  category: string;
}

export interface StoreLocationData {
  address: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
}

export interface StoreProfileData extends StoreBasicsData, StoreLocationData {}

export const validateStoreBasics = async (
  data: StoreBasicsData,
  setErrors: (errors: Record<string, string>) => void
): Promise<boolean> => {
  try {
    // Validate with Yup schema
    const formData = {
      storeName: data.storeName,
      storeEmail: data.storeEmail,
      phone: data.phone,
      description: data.description,
    };
    await basicsSchema.validate(formData, { abortEarly: false });

    // Custom category validation
    if (!data.category || data.category.trim() === '') {
      throw new Error('Store category is required');
    }

    // Clear errors
    setErrors({});
    return true;
  } catch (validationError: any) {
    const newErrors: Record<string, string> = {};

    // Handle Yup validation errors
    if (validationError.inner) {
      validationError.inner.forEach((err: any) => {
        newErrors[err.path] = err.message;
      });
    } else {
      // Handle custom validation errors (like category)
      newErrors.category = validationError.message;
    }

    setErrors(newErrors);
    return false;
  }
};

export const validateStoreLocation = async (
  data: StoreLocationData,
  setErrors: (errors: Record<string, string>) => void
): Promise<boolean> => {
  try {
    await locationSchema.validate(data, { abortEarly: false });

    // Clear errors
    setErrors({});
    return true;
  } catch (validationError: any) {
    const newErrors: Record<string, string> = {};

    validationError.inner.forEach((err: any) => {
      // Map postalCode back to cap for error display
      const fieldName = err.path === 'postalCode' ? 'cap' : err.path;
      newErrors[fieldName] = err.message;
    });

    setErrors(newErrors);
    return false;
  }
};

export const validateStoreProfile = async (
  data: StoreProfileData,
  setErrors: (errors: Record<string, string>) => void
): Promise<boolean> => {
  try {
    await editProfileSchema.validate(data, { abortEarly: false });
    setErrors({});
    return true;
  } catch (validationError: any) {
    const newErrors: Record<string, string> = {};
    validationError.inner.forEach((err: any) => {
      newErrors[err.path] = err.message;
    });
    setErrors(newErrors);
    return false;
  }
};
