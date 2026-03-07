const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    type: { type: String, enum: ['CAR', 'RICKSHAW'], required: true },
    reg_number: { type: String, required: true, unique: true },
    capicity: { type: Number, required: true },
    rcDocUrl: { type: String, required: false },
    insuranceDocUrl: { type: String, required: false },
    photoUrl: { type: String, required: false },
    make: { type: String, required: false },
    model: { type: String, required: false },
    year: { type: Number, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
