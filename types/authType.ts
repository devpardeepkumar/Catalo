export interface RegistrationFormData {
  companyName: string;
  registeredOffice: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  vatNumber: string;
  taxCode: string;
  sdiCode: string;
  rea: string;
  pecEmail: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

export interface DocumentFile {
  name: string;
  uri: string;
  mimeType?: string;
}