import { apiClient } from './apiClient';

export interface TripLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface CreateTripPayload {
  startLocation: TripLocation;
  endLocation: TripLocation;
  vehicleType: 'auto' | 'car';
  fareEstimation: number;
}

export const tripService = {
  /**
   * Passenger creates a new trip request.
   * Path: POST /trips
   */
  createTrip: async (data: CreateTripPayload) => {
    const response = await apiClient.post('/trips', data);
    return response.data;
  },

  /**
   * Driver marks the trip as active/started.
   * Path: PATCH /trips/:id/start
   */
  driverStartTrip: async (id: string) => {
    const response = await apiClient.patch(`/trips/${id}/start`);
    return response.data;
  },

  /**
   * Driver marks the trip as completed.
   * Path: PATCH /trips/:id/complete
   */
  driverCompleteTrip: async (id: string, finalFare: number) => {
    const response = await apiClient.patch(`/trips/${id}/complete`, { finalFare });
    return response.data;
  },

  /**
   * Passenger or Driver cancels the trip.
   * Path: DELETE /trips/:id
   */
  cancelTrip: async (id: string, reason?: string) => {
    const response = await apiClient.delete(`/trips/${id}`, { data: { reason } });
    return response.data;
  },

  /**
   * Get real-time details of an active or past trip.
   * Path: GET /trips/:id
   */
  getTripById: async (id: string) => {
    const response = await apiClient.get(`/trips/${id}`);
    return response.data;
  },

  /**
   * Specific logic to search for active Car pool trips heading the same way.
   * Path: GET /trips/search
   */
  searchCarTrips: async (params: { startLat: string; startLng: string; endLat: string; endLng: string }) => {
    const response = await apiClient.get('/trips/search', { params });
    return response.data;
  },
};
