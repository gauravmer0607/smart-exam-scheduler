const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/authRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// --- 1. CORE MIDDLEWARES ---
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// --- 2. DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/timecodes';

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected: Database is active"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1); // Stop server if DB connection fails
    });

// --- 3. ROUTES MAPPING ---
app.use('/api/auth', authRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/users', userRoutes);

// --- 4. GLOBAL ERROR HANDLERS ---

// Handle 404 - Not Found
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Handle 500 - Internal Server Error
app.use((err, req, res, next) => {
    console.error("Internal Error:", err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// --- 5. SERVER INITIALIZATION ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 TIMECODES SERVER RUNNING`);
    console.log(`🔗 Local: http://localhost:${PORT}`);
    console.log(`🛠️  Ready for timetable generation\n`);
});