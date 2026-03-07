const mongoose = require('mongoose');
const ratingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    trip:{type:mongoose.Schema.Type.ObjectId , ref:'Trip' , required:false},
    booking:{type:mongoose.Schema.Type.ObjectId , ref:'Booking' , required:false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
