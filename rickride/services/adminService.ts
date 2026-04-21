import { apiClient } from './apiClient';
import { ApiResponse } from './types';
import { useAuthStore } from '../store/useAuthStore';

export interface AdminStats {
  totalUsers: number;
  totalDrivers: number;
  totalTrips: number;
  totalBookings: number;
  totalPayments: number;
}

export const adminService = {
  async getStats() {
    const token = useAuthStore.getState().token;
    if (token === 'mock_admin_token') {
      return {
        totalUsers: 1420,
        totalDrivers: 320,
        totalTrips: 5800,
        totalBookings: 6100,
        totalPayments: 8400,
      } as AdminStats;
    }

    const response = await apiClient.get<ApiResponse<AdminStats>>('/admin/stats');
    return response.data.data;
  },
};
