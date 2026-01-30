import apiClient from './apiClient';
import { Notification } from '../../types/notification';

const notificationsApi = {
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
    type?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.unreadOnly) queryParams.append('unreadOnly', 'true');
    if (params?.type) queryParams.append('type', params.type);
    
    const response = await apiClient.get(`/notifications?${queryParams.toString()}`);
    return response.data.data;
  },

  markAsRead: async (id: string) => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.put('/notifications/read-all');
    return response.data.data;
  },

  deleteNotification: async (id: string) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data.data;
  },
};

export default notificationsApi;
