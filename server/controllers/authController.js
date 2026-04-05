const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * SIGNUP LOGIC
 * Creates a new user, hashes password, and returns a JWT
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if User exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Hash Password (bcrypt salt)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save User to Database
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword 
    });
    
    await user.save();

    // 4. Generate JWT Token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "Internal Server Error: Missing JWT Secret" });
    }
    
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });

  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ msg: 'Server Error during registration' });
  }
};

/**
 * LOGIN LOGIC
 * Validates credentials and returns a JWT
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ msg: 'Server Error during login' });
  }
};