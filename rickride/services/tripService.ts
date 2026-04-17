import { apiClient } from './apiClient';
import { ApiListResponse, ApiResponse, Trip } from './types';

export interface CreateTripPayload {
  driverId?: string;
  origin: [number, number];
  destination: [number, number];
  distance: number;
  departureTime: string;
  totalSeats: number;
  pricePerSeat: number;
  notes?: string;
}

export const tripService = {
  async createTrip(data: CreateTripPayload) {
    const response = await apiClient.post<ApiResponse<Trip>>('/trip', data);
    return response.data.data;
  },

  async getTrips(params?: {
    status?: Trip['status'];
    driverId?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get<ApiListResponse<Trip>>('/trip', {
      params,
    });
    return response.data;
  },

  async getTripById(id: string) {
    const response = await apiClient.get<ApiResponse<Trip>>(`/trip/${id}`);
    return response.data.data;
  },

  async updateTripStatus(id: string, status: Trip['status']) {
    const response = await apiClient.put<ApiResponse<Trip>>(`/trip/${id}/status`, { status });
    return response.data.data;
  },
};
