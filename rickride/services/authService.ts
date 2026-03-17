import { apiClient } from './apiClient';

export interface RequestOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export const authService = {
  /**
   * Request an OTP to be sent to a phone number.
   * Path: POST /auth/request-otp
   */
  requestOtp: async (data: RequestOtpPayload) => {
    const response = await apiClient.post('/auth/request-otp', data);
    return response.data;
  },

  /**
   * Verify an OTP to login/register yielding secure tokens.
   * Path: POST /auth/verify-otp
   */
  verifyOtp: async (data: VerifyOtpPayload) => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },
};
