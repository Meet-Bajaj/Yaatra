const mongoose = require('mongoose'); 
const { create } = require('./users');

const driverSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    licenseNumber: { type: String, required: true, unique: true },
    // vehicleType: { type: String, required: true },
    vehicle: {type:mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true},
    status: { type: String, enum: ['offline', 'online' , 'onTrip'], default: 'offline'},
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]}
    },
    operatingZone: { type: String, required: false },
    kyc: {
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        rejectedReason: { type: String, required: false },        
    },

    totalRides: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}) 

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
