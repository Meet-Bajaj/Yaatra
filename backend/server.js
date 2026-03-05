
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
