import { apiClient } from './apiClient';
import { ApiResponse } from './types';

export interface AdminStats {
  totalUsers: number;
  totalDrivers: number;
  totalTrips: number;
  totalBookings: number;
  totalPayments: number;
}

export const adminService = {
  async getStats() {
    const response = await apiClient.get<ApiResponse<AdminStats>>('/admin/stats');
    return response.data.data;
  },
};
