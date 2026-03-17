import { apiClient } from './apiClient';

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  avatar?: string;
}

export const userService = {
  /**
   * Get the currently authenticated passenger's profile.
   * Path: GET /users/me
   */
  getMe: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  /**
   * Update the passenger's own profile settings.
   * Path: PUT /users/me
   */
  updateMe: async (data: UpdateUserPayload) => {
    const response = await apiClient.put('/users/me', data);
    return response.data;
  },

  /**
   * Fetch limited public profile details for another user (e.g., driver seeing rider info)
   * Path: GET /users/:id
   */
  getPublicProfile: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
};
