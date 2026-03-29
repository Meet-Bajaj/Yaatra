import { apiClient } from './apiClient';
import { ApiResponse, DriverProfile } from './types';

export interface DriverProfilePayload {
  userId?: string;
  licenseNumber: string;
  operatingZone?: string;
  vehicleId?: string | null;
}

export interface DriverStatusPayload {
  driverId?: string;
  status: 'offline' | 'online' | 'onTrip';
}

export interface DriverLocationPayload {
  driverId?: string;
  longitude: number;
  latitude: number;
  status?: 'offline' | 'online' | 'onTrip';
}

export const driverService = {
  async upsertProfile(data: DriverProfilePayload) {
    const response = await apiClient.post<ApiResponse<DriverProfile>>('/driver/profile', data);
    return response.data.data;
  },

  async getMyDriverProfile(userId?: string) {
    const response = await apiClient.get<ApiResponse<DriverProfile>>('/driver/profile', {
      params: userId ? { userId } : undefined,
    });
    return response.data.data;
  },

  async updateDriverStatus(data: DriverStatusPayload) {
    const response = await apiClient.put<ApiResponse<DriverProfile>>('/driver/status', data);
    return response.data.data;
  },

  async updateDriverLocation(data: DriverLocationPayload) {
    const response = await apiClient.put<ApiResponse<DriverProfile>>('/driver/location', data);
    return response.data.data;
  },

  async getNearbyDrivers(longitude: number, latitude: number, radiusKm = 5, limit = 10) {
    const response = await apiClient.get<ApiResponse<DriverProfile[]>>('/driver/nearby', {
      params: {
        longitude,
        latitude,
        radiusKm,
        limit,
      },
    });
    return response.data.data;
  },
};
