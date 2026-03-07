const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, min:0 ,  required: true  },
    gateway: { type: String, enum: ['STRIP', 'PAYPAL', 'RAZORPAY'], required: true },
    gatewayTransactionId: { type: String, required: false , unique: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    rawResponse: { type: Object, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
