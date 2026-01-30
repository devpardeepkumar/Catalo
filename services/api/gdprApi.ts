import apiClient from './apiClient';

// Types for GDPR operations
export interface DeleteAccountResponse {
  success: boolean;
  message: string;
}

// Types for GDPR operations
export interface ExportDataResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface CookieConsentPayload {
  policyVersion: string;
  granted: boolean;
}

export interface CookieConsentResponse {
  success: boolean;
  message: string;
}

// GDPR API service functions
export const gdprApi = {
  // Delete user account (GDPR right to erasure)
  deleteAccount: async (): Promise<DeleteAccountResponse> => {
    const response = await apiClient.delete('/gdpr/me');
    return response.data;
  },

  // Export user data (GDPR right to data portability)
  exportData: async (): Promise<ExportDataResponse> => {
    const response = await apiClient.get('/gdpr/me/export');
    return response.data;
  },

  // Update cookie consent
  cookieConsent: async (payload: CookieConsentPayload): Promise<CookieConsentResponse> => {
    const response = await apiClient.post('/gdpr/consents/cookie', payload);
    return response.data;
  },
};
