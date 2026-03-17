import { apiClient } from './apiClient';

export interface CreateRatingPayload {
  tripId: string;
  targetUserId: string;
  ratingValue: number;
  review?: string;
  role: 'passenger' | 'driver'; // who is giving the rating
}

export const ratingService = {
  /**
   * Submit a rating (either driver to passenger, or passenger to driver).
   * Path: POST /ratings
   */
  createRating: async (data: CreateRatingPayload) => {
    const response = await apiClient.post('/ratings', data);
    return response.data;
  },

  /**
   * Get all ratings received by a specific passenger/user.
   * Path: GET /ratings/user/:id
   */
  getUserRatings: async (userId: string) => {
    const response = await apiClient.get(`/ratings/user/${userId}`);
    return response.data;
  },

  /**
   * Get all ratings received by a specific driver.
   * Path: GET /ratings/driver/:id
   */
  getDriverRatings: async (driverId: string) => {
    const response = await apiClient.get(`/ratings/driver/${driverId}`);
    return response.data;
  },
};
