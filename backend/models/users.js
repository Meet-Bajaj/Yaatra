const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // username: { type: String, required: true, unique: true },
    name: { type: String, required: false },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: false },
    role: { type: String, enum: ['rider', 'driver' , 'admin'], default: 'rider' },
    walletBalance: { type: Number, default: 0 },
    rating: { type: Number, default: 0 , min: 0, max: 5 },
    avatarUrl: { type: String, required: false },
    fcmToken: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
