require('dotenv').config();

const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/RikRide';
const connectDB = mongoose.connect(MONGO_URI, {
  dbName: process.env.MONGO_DB_NAME,
}).then(() => {
  console.log('✅ MongoDB connected successfully ');
}
).catch((err) => {
  console.log('❌ MongoDB connection error:', err);
  process.exit(1);
});
module.export = connectDB;

