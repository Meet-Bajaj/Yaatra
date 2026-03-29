import { apiClient } from './apiClient';
import { ApiResponse, User } from './types';

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  avatarUrl?: string;
  fcmToken?: string;
}

export const userService = {
  async getMyProfile() {
    const response = await apiClient.get<ApiResponse<User>>('/user/profile');
    return response.data.data;
  },

  async updateMyProfile(data: UpdateUserPayload) {
    const response = await apiClient.put<ApiResponse<User>>('/user/profile', data);
    return response.data.data;
  },
};
