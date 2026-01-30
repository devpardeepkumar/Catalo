import apiClient from './apiClient';

// Analytics API service functions
export const analyticsApi = {
  getAlerts: async (): Promise<any> => {
    const response = await apiClient.get('/retailers/analytics/alerts');
    return response.data;
  },
  getMetrics: async (): Promise<any> => {
    const response = await apiClient.get('/retailers/analytics/metrics');
    return response.data;
  },
  getStats: async (): Promise<any> => {
    const response = await apiClient.get('/retailers/stats');
    return response.data;
  },
  uploadCsv: async (file: FormData): Promise<any> => {
    const response = await apiClient.post('/retailers/inventory/csv/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

