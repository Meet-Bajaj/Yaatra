const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    origin: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
    destination: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
    distance: { type: Number, required: true }, // in kilometers
    dipartureTime: { type: Date, required: true },
    totalSeats: { type: Number, min:1 ,  required: true },
    pricePerSeat: { type: Number, required: true },
    // availableSeats: { type: Number, min:0 , required: true },
    status: { type: String, enum: ['open', 'full', 'ongoing' ,  'completed', 'cancelled'], default: 'open' },
    notes: { type: String, required: false },
    //  riders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    //  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
