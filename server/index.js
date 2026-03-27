// server/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // JSON data read karne ke liye
app.use('/api/auth', require('./routes/authRoutes'));

// Test Route
app.get('/', (req, res) => {
  res.send('TIMECODES Backend is running... 🚀');
});

// Port Logic
const PORT = process.env.PORT || 5000;

// Database Connection & Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.log('❌ DB Connection Error:', err));

