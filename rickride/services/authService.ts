import { apiClient } from './apiClient';
import { ApiResponse, User, UserRole } from './types';

export interface RegisterPayload {
  phone: string;
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface LoginPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  code: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export const authService = {
  async register(data: RegisterPayload) {
    const response = await apiClient.post<ApiResponse<AuthSession>>('/auth/register', data);
    return response.data.data;
  },

  async login(data: LoginPayload) {
    const response = await apiClient.post<
      ApiResponse<{ phone: string; delivery: string; mockCode?: string }>
    >('/auth/login', data);
    return response.data.data;
  },

  async verifyOtp(data: VerifyOtpPayload) {
    const response = await apiClient.post<ApiResponse<AuthSession>>('/auth/verify-otp', data);
    return response.data.data;
  },
};
