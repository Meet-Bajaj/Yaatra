import { apiClient } from './apiClient';

export interface BookRidePayload {
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
  fare: number;
}

export const bookingService = {
  /**
   * Create a booking specifically for a CAR (e.g. carpool).
   * Path: POST /bookings/car
   */
  bookCarTrip: async (data: BookRidePayload) => {
    const response = await apiClient.post('/bookings/car', data);
    return response.data;
  },

  /**
   * Create a booking specifically for an Auto Rickshaw.
   * Path: POST /bookings/auto
   */
  bookAuto: async (data: BookRidePayload) => {
    const response = await apiClient.post('/bookings/auto', data);
    return response.data;
  },

  /**
   * Retrieve passenger's booking history.
   * Path: GET /bookings/me
   */
  getMyBookings: async () => {
    const response = await apiClient.get('/bookings/me');
    return response.data;
  },

  /**
   * Cancel an active booking sequence before trip begins.
   * Path: DELETE /bookings/:id
   */
  cancelBooking: async (id: string) => {
    const response = await apiClient.delete(`/bookings/${id}`);
    return response.data;
  },
};
