import { mockPayments } from './mockData';

export const paymentService = {
    getPaymentById: async (id: string) => {
        return mockPayments.find(payment => payment._id === id);
    },
    getPaymentByBookingId: async (bookingId: string) => {
        return mockPayments.find(payment => payment.booking === bookingId);
    },
    getAllPayments: async () => {
        return mockPayments;
    },
};
