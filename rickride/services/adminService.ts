import { apiClient } from './apiClient';

export const adminService = {
  /**
   * Get all pending driver applications for review.
   * Path: GET /admin/drivers/pending
   */
  getPendingDrivers: async () => {
    const response = await apiClient.get('/admin/drivers/pending');
    return response.data;
  },

  /**
   * Approve a driver onboarding request.
   * Path: PATCH /admin/drivers/:driverId/approve
   */
  approveDriver: async (driverId: string) => {
    const response = await apiClient.patch(`/admin/drivers/${driverId}/approve`);
    return response.data;
  },

  /**
   * Reject a driver onboarding request.
   * Path: PATCH /admin/drivers/:driverId/reject
   */
  rejectDriver: async (driverId: string, reason?: string) => {
    const response = await apiClient.patch(`/admin/drivers/${driverId}/reject`, { reason });
    return response.data;
  },

  /**
   * Fetch all registered users matching admin filters.
   * Path: GET /admin/users
   */
  getAllUsers: async (params?: Record<string, any>) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  /**
   * Soft delete or ban a user from the platform entirely.
   * Path: DELETE /admin/users/:id
   */
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Analytics and overview of all trips.
   * Path: GET /admin/trips
   */
  getAllTrips: async (params?: Record<string, any>) => {
    const response = await apiClient.get('/admin/trips', { params });
    return response.data;
  },

  /**
   * Analytics and overview of all incoming bookings.
   * Path: GET /admin/bookings
   */
  getAllBookings: async (params?: Record<string, any>) => {
    const response = await apiClient.get('/admin/bookings', { params });
    return response.data;
  },
};
