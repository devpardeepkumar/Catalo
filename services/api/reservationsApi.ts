import apiClient from './apiClient';

// Reservations API service functions
export const reservationsApi = {
  getReservations: async (page: number = 1, limit: number = 20, status?: string): Promise<any> => {
    let url = `/retailers/reservations?page=${page}&limit=${limit}`;
    if (status && status !== 'all') {
      // Map UI status filters to API status values
      const statusMap: { [key: string]: string } = {
        'pending': 'requested',
        'active': 'confirmed',
        'completed': 'completed',
        'canceled': 'cancelled',
        
      };
      const apiStatus = statusMap[status] || status;
      url += `&status=${apiStatus}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  confirmReservation: async (reservationId: string): Promise<any> => {
    const response = await apiClient.put(`/retailers/reservations/${reservationId}/status`, {
      status: 'confirmed'
    });
    return response.data;
  },
};
