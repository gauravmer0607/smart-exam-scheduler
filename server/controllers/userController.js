const User = require('../models/User');

// 🔥 Ensure karo 'exports.' laga hua hai
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ msg: "User not found" });
        
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};