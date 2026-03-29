import { apiClient } from './apiClient';
import { ApiResponse, Booking } from './types';

export interface CreateBookingPayload {
  riderId?: string;
  tripId?: string;
  autoDriverId?: string;
  seats?: number;
  fare?: number;
  paymentMethod: 'RAZORPAY' | 'CASH' | 'WALLET';
}

export const bookingService = {
  async createBooking(data: CreateBookingPayload) {
    const response = await apiClient.post<ApiResponse<Booking>>('/booking', data);
    return response.data.data;
  },

  async getBooking(id: string) {
    const response = await apiClient.get<ApiResponse<Booking>>(`/booking/${id}`);
    return response.data.data;
  },

  async cancelBooking(id: string) {
    const response = await apiClient.post<ApiResponse<Booking>>(`/booking/${id}/cancel`);
    return response.data.data;
  },
};
