import express from 'express';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import FoodItem from '../models/FoodItem.js';
import Order from '../models/Order.js';
import Feedback from '../models/Feedback.js';
import Vendor from '../models/Vendor.js';

const router = express.Router();

// All routes require vendor authentication
router.use(auth);
router.use(checkRole('vendor'));

// Get vendor profile
router.get('/profile', async (req, res) => {
  const vendor = await Vendor.findById(req.user.id).select('-password -otp -otpExpiry');
  res.json({ vendor });
});

// Update vendor profile
router.put('/profile', async (req, res) => {
  const { name, phone, restaurantName, location } = req.body;
  
  const vendor = await Vendor.findByIdAndUpdate(
    req.user.id,
    { name, phone, restaurantName, location },
    { new: true }
  ).select('-password -otp -otpExpiry');

  res.json({ message: 'Profile updated successfully', vendor });
});

// Add food item
router.post('/food-items', async (req, res) => {
  const { name, description, price, category, image } = req.body;

  const foodItem = new FoodItem({
    vendorId: req.user.id,
    name,
    description,
    price,
    category,
    image
  });

  await foodItem.save();
  res.status(201).json({ message: 'Food item added successfully', foodItem });
});

// Get vendor's food items
router.get('/food-items', async (req, res) => {
  const foodItems = await FoodItem.find({ vendorId: req.user.id })
    .sort({ createdAt: -1 });
  res.json({ foodItems });
});

// Update food item
router.put('/food-items/:id', async (req, res) => {
  const { name, description, price, category, image, available } = req.body;

  const foodItem = await FoodItem.findOneAndUpdate(
    { _id: req.params.id, vendorId: req.user.id },
    { name, description, price, category, image, available },
    { new: true }
  );

  if (!foodItem) {
    return res.status(404).json({ error: 'Food item not found' });
  }

  res.json({ message: 'Food item updated successfully', foodItem });
});

// Delete food item
router.delete('/food-items/:id', async (req, res) => {
  const foodItem = await FoodItem.findOneAndDelete({
    _id: req.params.id,
    vendorId: req.user.id
  });

  if (!foodItem) {
    return res.status(404).json({ error: 'Food item not found' });
  }

  res.json({ message: 'Food item deleted successfully' });
});

// Get vendor's orders
router.get('/orders', async (req, res) => {
  const orders = await Order.find({ vendorId: req.user.id })
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 });
  
  res.json({ orders });
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  const { status } = req.body;

  if (!['Pending', 'Preparing', 'On the way', 'Delivered'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, vendorId: req.user.id },
    { deliveryStatus: status },
    { new: true }
  ).populate('userId', 'name email phone');

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ message: 'Order status updated successfully', order });
});

// Get vendor's feedback
router.get('/feedback', async (req, res) => {
  const feedback = await Feedback.find({ vendorId: req.user.id })
    .populate('userId', 'name')
    .populate('orderId')
    .sort({ createdAt: -1 });
  
  res.json({ feedback });
});

// Dashboard stats
router.get('/stats', async (req, res) => {
  const [totalItems, totalOrders, pendingOrders, avgRating] = await Promise.all([
    FoodItem.countDocuments({ vendorId: req.user.id }),
    Order.countDocuments({ vendorId: req.user.id }),
    Order.countDocuments({ vendorId: req.user.id, deliveryStatus: 'Pending' }),
    Feedback.aggregate([
      { $match: { vendorId: req.user.id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ])
  ]);

  res.json({
    stats: {
      totalItems,
      totalOrders,
      pendingOrders,
      avgRating: avgRating[0]?.avgRating || 0
    }
  });
});

export default router;