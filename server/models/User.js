const mongoose = require('mongoose');

/**
 * USER MODEL
 * Stores account details and an embedded array of generated timetables (History)
 */
const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    history: [
        {
            examName: { type: String },
            examType: { type: String }, // Mid-Sem or End-Sem filter ke liye
            generatedAt: { type: Date, default: Date.now },
            timetableData: { type: Array } // Flexible array for all scheduled rows
        }
    ]
}, { 
    // Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true 
});

// Check if model already exists to prevent OverwriteModelError in development
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);