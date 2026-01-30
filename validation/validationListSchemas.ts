import * as yup from 'yup';

// Step 1: Store Basics
export const basicsSchema = yup.object().shape({
  storeName: yup.string().required('Store name is required'),
  storeEmail: yup.string().email('Invalid email format').required('Store email is required'),
  phone: yup.string().required('Phone number is required').matches(/^\+?\d[\d\s-]{8,}$/, 'Invalid phone number'),
  description: yup.string().required('Store description is required').min(10, 'Description must be at least 10 characters'),
});

// Step 2: Location (used in your existing screen)
export const locationSchema = yup.object().shape({
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('CAP (ZIP code) is required'),
  state: yup.string().required('State is required').default('Italy'),
  country: yup.string().required('Country is required').default('Italy'),
});

// Step 3: Operating Settings
export const operatingSchema = yup.object().shape({
  daysTimes: yup.array().of(
    yup.object().shape({
      day: yup.string().required(),
      openTime: yup.string().nullable(),
      closeTime: yup.string().nullable(),
      isClosed: yup.boolean(),
    })
  ),
  enableVacationMode: yup.boolean(),
});

// Holiday validation schema
export const holidaySchema = yup.object().shape({
  date: yup.date().required('Date is required'),
  reason: yup.string().required('Reason is required').min(2, 'Reason must be at least 2 characters'),
});

// Complete profile update schema
export const updateProfileSchema = yup.object().shape({
  basics: yup.object().shape({
    storeName: yup.string().required('Store name is required').min(2, 'Store name must be at least 2 characters'),
    storeEmail: yup.string().email('Invalid email format').required('Store email is required'),
    phone: yup.string().required('Phone number is required').matches(/^\+?\d[\d\s-]{8,}$/, 'Invalid phone number'),
    description: yup.string().required('Store description is required').min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
    logo: yup.string().nullable(),
  }),
  location: yup.object().shape({
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    cap: yup.string().required('CAP (ZIP code) is required'),
    state: yup.string().required('State is required'),
    country: yup.string().required('Country is required'),
    latitude: yup.number().nullable(),
    longitude: yup.number().nullable(),
  }),
  timeSettings: operatingSchema,
  holidays: yup.array().of(holidaySchema),
});


// Edit Store Profile Modal validation
export const editProfileSchema = yup.object().shape({
  storeName: yup.string().required('Store name is required').min(2, 'Store name must be at least 2 characters'),
  storeEmail: yup.string().email('Invalid email format').required('Store email is required'),
  phone: yup.string().required('Phone number is required').matches(/^\+?\d[\d\s-]{8,}$/, 'Invalid phone number'),
  description: yup.string().required('Store description is required').min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  category: yup.string().required('Store category is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  cap: yup.string().required('CAP (ZIP code) is required'),
  state: yup.string().required('State is required'),
});