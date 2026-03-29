import { apiClient } from './apiClient';
import { ApiResponse, Payment } from './types';

export interface CreatePaymentPayload {
  bookingId: string;
  amount?: number;
  gateway?: 'RAZORPAY' | 'CASH' | 'WALLET';
}

export interface VerifyPaymentPayload {
  paymentId: string;
  gatewayTransactionId?: string;
  status?: 'pending' | 'completed' | 'failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

export const paymentService = {
  async createPayment(data: CreatePaymentPayload) {
    const response = await apiClient.post<
      ApiResponse<{
        payment: Payment;
        gateway: {
          provider: 'razorpay';
          keyId: string;
          order: Record<string, unknown>;
        } | null;
      }>
    >('/payment/create', data);
    return response.data.data;
  },

  async verifyPayment(data: VerifyPaymentPayload) {
    const response = await apiClient.post<ApiResponse<Payment>>('/payment/verify', data);
    return response.data.data;
  },
};
