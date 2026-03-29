import { apiClient } from './apiClient';
import { ApiResponse } from './types';

export interface CreateRatingPayload {
  driverId: string;
  rating: number;
  comment?: string;
  tripId?: string;
  bookingId?: string;
}

export interface DriverRating {
  _id: string;
  user: {
    _id: string;
    name?: string;
    avatarUrl?: string;
  };
  rating: number;
  comment?: string;
  createdAt?: string;
}

export const ratingService = {
  async createRating(data: CreateRatingPayload) {
    const response = await apiClient.post<ApiResponse<DriverRating>>('/rating', data);
    return response.data.data;
  },

  async getDriverRatings(driverId: string, page = 1, limit = 10) {
    const response = await apiClient.get<ApiResponse<DriverRating[]>>(`/rating/${driverId}`, {
      params: { page, limit },
    });
    return response.data;
  },
};
