import { apiClient } from './apiClient';

export const paymentService = {
  /**
   * Manual endpoint to trigger Razorpay webhook testing (mostly internal).
   * Note: Webhooks usually fire backend-to-backend directly from Razorpay,
   * but exposing the client interface per spec.
   * Path: POST /payments/razorpay/webhook
   */
  razorpayWebhook: async (payload: any) => {
    const response = await apiClient.post('/payments/razorpay/webhook', payload);
    return response.data;
  },
};
