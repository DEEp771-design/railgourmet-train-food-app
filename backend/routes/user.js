import express from 'express';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import User from '../models/User.js';
import FoodItem from '../models/FoodItem.js';
import Order from '../models/Order.js';
import Feedback from '../models/Feedback.js';
import Vendor from '../models/Vendor.js';

const router = express.Router();

// All routes require user authentication
router.use(auth);
router.use(checkRole('user'));

// Get user profile
router.get('/profile', async (req, res) => {
  const user = await User.findById(req.user.id).select('-password -otp -otpExpiry');
  res.json({ user });
});

// Update user profile
router.put('/profile', async (req, res) => {
  const { name, phone } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone },
    { new: true }
  ).select('-password -otp -otpExpiry');

  res.json({ message: 'Profile updated successfully', user });
});

// Search restaurants
router.get('/restaurants', async (req, res) => {
  const { search } = req.query;
  
  const query = { isApproved: true, isVerified: true };
  if (search) {
    query.$or = [
      { restaurantName: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }

  const restaurants = await Vendor.find(query)
    .select('restaurantName location createdAt')
    .sort({ restaurantName: 1 });
  
  res.json({ restaurants });
});

// Get restaurant details
router.get('/restaurants/:id', async (req, res) => {
  const restaurant = await Vendor.findOne({
    _id: req.params.id,
    isApproved: true,
    isVerified: true
  }).select('restaurantName location');

  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  res.json({ restaurant });
});

// Search food items
router.get('/food-items', async (req, res) => {
  const { search, category, vendorId } = req.query;
  
  const query = { available: true };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (category) {
    query.category = category;
  }
  
  if (vendorId) {
    query.vendorId = vendorId;
  }

  const foodItems = await FoodItem.find(query)
    .populate('vendorId', 'restaurantName location')
    .sort({ createdAt: -1 });
  
  res.json({ foodItems });
});

// Get food item details
router.get('/food-items/:id', async (req, res) => {
  const foodItem = await FoodItem.findOne({ 
    _id: req.params.id, 
    available: true 
  }).populate('vendorId', 'restaurantName location');

  if (!foodItem) {
    return res.status(404).json({ error: 'Food item not found' });
  }

  res.json({ foodItem });
});

// Place order
router.post('/orders', async (req, res) => {
  const { items, pnr, trainNumber } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items in cart' });
  }

  // Calculate total and verify items
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const foodItem = await FoodItem.findById(item.foodItemId);
    if (!foodItem || !foodItem.available) {
      return res.status(400).json({ error: `Item ${item.foodItemId} not available` });
    }

    const itemTotal = foodItem.price * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      foodItemId: foodItem._id,
      name: foodItem.name,
      price: foodItem.price,
      quantity: item.quantity
    });
  }

  // Check wallet balance
  const user = await User.findById(req.user.id);
  if (user.walletBalance < totalAmount) {
    return res.status(400).json({ 
      error: 'Insufficient wallet balance',
      required: totalAmount,
      available: user.walletBalance
    });
  }

  // Deduct from wallet
  user.walletBalance -= totalAmount;
  await user.save();

  // Create order (assuming all items from same vendor for MVP)
  const vendorId = orderItems[0].foodItemId;
  const foodItemDoc = await FoodItem.findById(vendorId);
  
  const order = new Order({
    userId: req.user.id,
    vendorId: foodItemDoc.vendorId,
    items: orderItems,
    totalAmount,
    pnr,
    trainNumber
  });

  await order.save();

  res.status(201).json({ 
    message: 'Order placed successfully',
    order,
    remainingBalance: user.walletBalance
  });
});

// Get user's orders
router.get('/orders', async (req, res) => {
  const orders = await Order.find({ userId: req.user.id })
    .populate('vendorId', 'restaurantName location')
    .sort({ createdAt: -1 });
  
  res.json({ orders });
});

// Get order details
router.get('/orders/:id', async (req, res) => {
  const order = await Order.findOne({ 
    _id: req.params.id, 
    userId: req.user.id 
  }).populate('vendorId', 'restaurantName location phone');

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ order });
});

// Post feedback
router.post('/feedback', async (req, res) => {
  const { orderId, rating, comment } = req.body;

  // Verify order belongs to user
  const order = await Order.findOne({ 
    _id: orderId, 
    userId: req.user.id,
    deliveryStatus: 'Delivered'
  });

  if (!order) {
    return res.status(404).json({ error: 'Order not found or not delivered yet' });
  }

  // Check if feedback already exists
  const existingFeedback = await Feedback.findOne({ orderId });
  if (existingFeedback) {
    return res.status(400).json({ error: 'Feedback already submitted for this order' });
  }

  const feedback = new Feedback({
    orderId,
    userId: req.user.id,
    vendorId: order.vendorId,
    rating,
    comment
  });

  await feedback.save();

  res.status(201).json({ message: 'Feedback submitted successfully', feedback });
});

// Get wallet balance
router.get('/wallet', async (req, res) => {
  const user = await User.findById(req.user.id).select('walletBalance');
  res.json({ walletBalance: user.walletBalance });
});

export default router;