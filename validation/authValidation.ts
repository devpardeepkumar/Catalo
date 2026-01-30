import * as Yup from 'yup';

export const registrationSchema = Yup.object().shape({
  companyName: Yup.string().required('Company name is required'),
  registeredOffice: Yup.string().required('Registered office is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  gender: Yup.string().oneOf(['M', 'F', 'O'], 'Invalid gender selection').required('Gender is required'),
  dateOfBirth: Yup.string()
    .required('Date of birth is required')
    .test('is-valid-date', 'Invalid date format', (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('is-adult', 'Must be at least 18 years old', (value) => {
      if (!value) return false;
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }),
  vatNumber: Yup.string()
    .matches(/^[A-Z0-9]{11}$/i, 'Invalid VAT number format (11 characters)')
    .required('VAT number is required'),
  // taxCode: Yup.string().required('Tax code is required'),
  sdiCode: Yup.string()
    .matches(/^[A-Z0-9]{6,7}$/, 'SDI code must be 6-7 characters')
    .optional(),
  // rea: Yup.string().optional(),
  pecEmail: Yup.string()
    .email('Invalid PEC email')
    .required('Certified email (PEC) is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(12, 'Password must be at least 12 characters')
    .matches(/[a-z]/, 'Must contain a lowercase letter')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .matches(/[^A-Za-z0-9]/, 'Must contain a special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  acceptTerms: Yup.boolean().oneOf([true], 'You must accept terms and conditions'),
  acceptPrivacy: Yup.boolean().oneOf([true], 'You must accept privacy policy'),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});