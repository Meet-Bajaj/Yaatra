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
    try {
      const { useAuthStore } = require('../store/useAuthStore');
      const token = useAuthStore.getState().token;
      if (token && token.startsWith('mock_')) {
        return {
          _id: 'mock_driver_id',
          userId: 'mock_user_id',
          licenseNumber: 'DL-123456789',
          operatingZone: 'Delhi NCR',
          vehicleId: null,
          isVerified: true,
          status: 'online',
          currentLocation: { type: 'Point', coordinates: [77.209, 28.6139] },
          rating: 4.8,
          totalRides: 142,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as DriverProfile;
      }
      
      const response = await apiClient.get<ApiResponse<DriverProfile>>('/driver/profile', {
        params: userId ? { userId } : undefined,
      });
      return response.data.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
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
    try {
      const { useAuthStore } = require('../store/useAuthStore');
      const token = useAuthStore.getState().token;
      if (token && token.startsWith('mock_')) {
        return [
          {
            _id: 'mock_driver_1',
            userId: { name: 'Ramesh Kumar', phone: '+919876543210' },
            location: { type: 'Point', coordinates: [longitude + 0.005, latitude + 0.005] },
            rating: 4.8,
            vehicleId: { type: 'auto', model: 'Bajaj RE', plateNumber: 'DL-01-AB-1234' }
          },
          {
            _id: 'mock_driver_2',
            userId: { name: 'Suresh Singh', phone: '+919876543211' },
            location: { type: 'Point', coordinates: [longitude - 0.008, latitude - 0.002] },
            rating: 4.6,
            vehicleId: { type: 'auto', model: 'Piaggio Ape', plateNumber: 'DL-02-XY-9876' }
          }
        ] as any[];
      }
      
      const response = await apiClient.get<ApiResponse<DriverProfile[]>>('/driver/nearby', {
        params: {
          longitude,
          latitude,
          radiusKm,
          limit,
        },
      });
      return response.data.data;
    } catch (error: any) {
      if (error?.response?.status === 404) return [];
      throw error;
    }
  },
};
