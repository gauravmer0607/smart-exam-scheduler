const express = require('express');
const router = express.Router();
const { generateAndSave } = require('../controllers/timetableController');

// POST: /api/timetable/generate
router.post('/generate', generateAndSave);

module.exports = router;