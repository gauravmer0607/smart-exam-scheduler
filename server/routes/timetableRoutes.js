const express = require('express');
const router = express.Router();
const { generateAndSave } = require('../controllers/timetableController');

router.post('/generate', generateAndSave);

module.exports = router;
// Auth Middleware (To verify JWT)
const auth = require('../middleware/auth'); // Make sure you have this middleware

router.post('/save-history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.history.unshift(req.body); // req.body contains examName, type, and timetableData
    await user.save();
    res.json({ msg: "History saved!" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});