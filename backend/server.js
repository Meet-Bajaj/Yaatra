// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { connectDB } from './config/db.js';
// import authRoutes from './routes/auth.js';
// import userRoutes from './routes/user.js';
// import rideRoutes from './routes/ride.js';
require('dotenv').config();
require('./config/db');
const express = require('express');
const app = express();

// dotenv.config();
// connectDB();

app.use(express.json());
// app.use(cors());
app.get('/', (req, res) => {
  res.send('Welcome to RickRide API');
});

app.listen(5000, () => {
  console.log('Server is running on  http://localhost:5000');
});
