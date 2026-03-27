
// SIGNUP LOGIC
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  console.log("📥 Signup Request Aayi:", req.body); // Check karo data aa raha hai ya nahi

  try {
    const { name, email, password } = req.body;

    // 1. Check if User exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("❌ User already exists");
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Hash Password
    console.log("🔐 Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save User
    console.log("💾 Saving user to DB...");
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    console.log("✅ User saved successfully!");

    // 4. Generate Token
    console.log("🎟️ Generating JWT...");
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in .env file!");
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

  } catch (err) {
    console.error("💥 SERVER ERROR DETAILS:", err.message); // Ye terminal mein error dikhayega
    res.status(500).json({ error: err.message }); // Ye Postman mein error dikhayega
  }
};

// LOGIN LOGIC
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

  } catch (err) {
    res.status(500).send('Server Error');
  }
};