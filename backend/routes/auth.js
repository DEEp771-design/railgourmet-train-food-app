import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Admin from '../models/Admin.js';
import { generateOTP } from '../utils/generateOTP.js';
import { sendOTP } from '../utils/sendOTP.js';

const router = express.Router();

// Helper to get model based on role
const getModel = (role) => {
  switch(role) {
    case 'user': return User;
    case 'vendor': return Vendor;
    case 'admin': return Admin;
    default: throw new Error('Invalid role');
  }
};

// User/Vendor Registration
router.post('/register', async (req, res) => {
  const { name, email, password, phone, role, restaurantName, location } = req.body;

  if (!['user', 'vendor'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const Model = getModel(role);
  
  // Check if user already exists
  const existing = await Model.findOne({ email });
  if (existing) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Create user/vendor
  const userData = {
    name,
    email,
    password,
    phone,
    role,
    otp,
    otpExpiry
  };

  if (role === 'vendor') {
    userData.restaurantName = restaurantName;
    userData.location = location;
  }

  const newUser = new Model(userData);
  await newUser.save();

  // Send OTP
  await sendOTP(email, otp, name);

  res.status(201).json({
    message: 'Registration successful! Please verify your email with OTP.',
    email,
    role
  });
});

// OTP Verification
router.post('/verify-otp', async (req, res) => {
  const { email, otp, role } = req.body;

  const Model = getModel(role);
  const user = await Model.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.isVerified) {
    return res.status(400).json({ error: 'Account already verified' });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  if (new Date() > user.otpExpiry) {
    return res.status(400).json({ error: 'OTP expired' });
  }

  // Verify user
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Email verified successfully!',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved
    }
  });
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  const { email, role } = req.body;

  const Model = getModel(role);
  const user = await Model.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.isVerified) {
    return res.status(400).json({ error: 'Account already verified' });
  }

  // Generate new OTP
  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  // Send OTP
  await sendOTP(email, otp, user.name);

  res.json({ message: 'OTP resent successfully!' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  const Model = getModel(role);
  const user = await Model.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (!user.isVerified && role !== 'admin') {
    return res.status(403).json({ error: 'Please verify your email first' });
  }

  if (role === 'vendor' && !user.isApproved) {
    return res.status(403).json({ error: 'Your account is pending admin approval' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful!',
    token,
    user: {
      id: user._id,
      name: user.name || 'Admin',
      email: user.email,
      role: user.role,
      walletBalance: user.walletBalance,
      restaurantName: user.restaurantName,
      isApproved: user.isApproved
    }
  });
});

export default router;
