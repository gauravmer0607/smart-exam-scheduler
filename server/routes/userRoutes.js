const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Check karo ki getUserProfile undefined to nahi hai
router.get('/profile/:id', userController.getUserProfile);

// 🔥 YE LINE CHECK KARO: Kya aapne 'router' hi export kiya hai?
module.exports = router;