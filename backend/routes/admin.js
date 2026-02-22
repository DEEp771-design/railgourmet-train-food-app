import express from 'express';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import Vendor from '../models/Vendor.js';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// All routes require admin authentication
router.use(auth);
router.use(checkRole('admin'));

// Get all pending vendors
router.get('/vendors/pending', async (req, res) => {
  const vendors = await Vendor.find({ 
    isVerified: true, 
    isApproved: false 
  }).select('-password -otp -otpExpiry');
  
  res.json({ vendors });
});

// Get all vendors
router.get('/vendors', async (req, res) => {
  const vendors = await Vendor.find()
    .select('-password -otp -otpExpiry')
    .sort({ createdAt: -1 });
  
  res.json({ vendors });
});

// Approve vendor
router.put('/vendors/:id/approve', async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  
  if (!vendor) {
    return res.status(404).json({ error: 'Vendor not found' });
  }

  vendor.isApproved = true;
  await vendor.save();

  res.json({ 
    message: 'Vendor approved successfully',
    vendor: {
      id: vendor._id,
      restaurantName: vendor.restaurantName,
      isApproved: vendor.isApproved
    }
  });
});

// Reject/Remove vendor approval
router.put('/vendors/:id/reject', async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  
  if (!vendor) {
    return res.status(404).json({ error: 'Vendor not found' });
  }

  vendor.isApproved = false;
  await vendor.save();

  res.json({ 
    message: 'Vendor approval removed',
    vendor: {
      id: vendor._id,
      restaurantName: vendor.restaurantName,
      isApproved: vendor.isApproved
    }
  });
});

// Get all users
router.get('/users', async (req, res) => {
  const users = await User.find()
    .select('-password -otp -otpExpiry')
    .sort({ createdAt: -1 });
  
  res.json({ users });
});

// Get user details
router.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -otp -otpExpiry');
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
});

// Get all abusive comments
router.get('/feedback/abusive', async (req, res) => {
  const feedback = await Feedback.find({ isAbusive: true })
    .populate('userId', 'name email')
    .populate('vendorId', 'restaurantName')
    .populate('orderId')
    .sort({ createdAt: -1 });
  
  res.json({ feedback });
});

// Get all feedback
router.get('/feedback', async (req, res) => {
  const feedback = await Feedback.find()
    .populate('userId', 'name email')
    .populate('vendorId', 'restaurantName')
    .populate('orderId')
    .sort({ createdAt: -1 });
  
  res.json({ feedback });
});

// Mark feedback as abusive
router.put('/feedback/:id/mark-abusive', async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);
  
  if (!feedback) {
    return res.status(404).json({ error: 'Feedback not found' });
  }

  feedback.isAbusive = true;
  await feedback.save();

  res.json({ message: 'Feedback marked as abusive' });
});

// Delete abusive comment
router.delete('/feedback/:id', async (req, res) => {
  const feedback = await Feedback.findByIdAndDelete(req.params.id);
  
  if (!feedback) {
    return res.status(404).json({ error: 'Feedback not found' });
  }

  res.json({ message: 'Feedback deleted successfully' });
});

// Dashboard stats
router.get('/stats', async (req, res) => {
  const [totalUsers, totalVendors, pendingVendors, totalFeedback] = await Promise.all([
    User.countDocuments(),
    Vendor.countDocuments({ isApproved: true }),
    Vendor.countDocuments({ isVerified: true, isApproved: false }),
    Feedback.countDocuments()
  ]);

  res.json({
    stats: {
      totalUsers,
      totalVendors,
      pendingVendors,
      totalFeedback
    }
  });
});

export default router;