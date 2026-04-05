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

// 🔥 CORS UPDATE: Frontend link allow kar diya hai
app.use(cors({
    origin: [
        'https://smart-exam-scheduler-eta.vercel.app', // Tera Main Production Domain
        'http://localhost:5173',                      // Local Development (Vite)
        'http://localhost:3000'                       // Local Development (CRA)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- 2. DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/timecodes';

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected: Database is active"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1); 
    });

// --- 3. ROUTES MAPPING ---
app.use('/api/auth', authRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/users', userRoutes);

// --- 4. GLOBAL ERROR HANDLERS ---

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

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
    console.log(`🔗 API Base: /api`);
    console.log(`🛠️  Ready for timetable generation\n`);
});