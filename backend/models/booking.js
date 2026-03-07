const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: false },
    autoDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: false },
    seats: { type: Number, required: false },
    fare:{type:Number , required:true},
    paymentMethod:{type:String, enum:['RAZORPAY','CASH','WALLET'], required:true},
    paymentReference: { type: String, required: false },
    driverAcceptedAt: { type: Date, required: false },
    completedAt: { type: Date, required: false },
    cancelledAt: { type: Date, required: false },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});



const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 
