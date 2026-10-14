import api from './api';
import { ApiResponse, CivicAnalytics, NotificationItem, PageResponse } from '../types';

export const analyticsService = {
  getPublicAnalytics: async (): Promise<CivicAnalytics> => {
    const res = await api.get<ApiResponse<CivicAnalytics>>('/analytics/public');
    return res.data.data;
  },

  getDashboardAnalytics: async (): Promise<CivicAnalytics> => {
    const res = await api.get<ApiResponse<CivicAnalytics>>('/analytics/dashboard');
    return res.data.data;
  },
};

export const notificationService = {
  getNotifications: async (page = 0, size = 15): Promise<PageResponse<NotificationItem>> => {
    const res = await api.get<ApiResponse<PageResponse<NotificationItem>>>('/notifications', {
      params: { page, size },
    });
    return res.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await api.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
    return res.data.data.unreadCount;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/mark-all-read');
  },
};
