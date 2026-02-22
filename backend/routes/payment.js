import express from 'express';
import Stripe from 'stripe';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_API_KEY);

// Wallet packages (fixed on backend for security)
const WALLET_PACKAGES = {
  small: 100.00,
  medium: 250.00,
  large: 500.00,
  xlarge: 1000.00
};

// Create checkout session
router.post('/checkout/session', auth, checkRole('user'), async (req, res) => {
  const { packageId, originUrl } = req.body;

  if (!packageId || !WALLET_PACKAGES[packageId]) {
    return res.status(400).json({ error: 'Invalid package selected' });
  }

  const amount = WALLET_PACKAGES[packageId];

  // Build dynamic URLs
  const successUrl = `${originUrl}/user/wallet?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${originUrl}/user/wallet`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Wallet Recharge - ₹${amount}`,
              description: 'Add money to your Train Food wallet'
            },
            unit_amount: Math.round(amount * 100) // Convert to paise
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: req.user.id,
        packageId,
        amount: amount.toString()
      }
    });

    // Create transaction record
    const transaction = new Transaction({
      userId: req.user.id,
      amount,
      sessionId: session.id,
      status: 'pending',
      paymentStatus: 'unpaid'
    });
    await transaction.save();

    res.json({ 
      url: session.url, 
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Check payment status
router.get('/checkout/status/:sessionId', auth, checkRole('user'), async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Find transaction
    const transaction = await Transaction.findOne({ sessionId });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update transaction status
    transaction.status = session.status;
    transaction.paymentStatus = session.payment_status;

    // If paid and not already credited
    if (session.payment_status === 'paid' && transaction.status !== 'completed') {
      // Credit wallet (only once)
      const user = await User.findById(transaction.userId);
      user.walletBalance += transaction.amount;
      await user.save();

      transaction.status = 'completed';
      await transaction.save();

      return res.json({
        status: session.status,
        paymentStatus: session.payment_status,
        amount: transaction.amount,
        walletBalance: user.walletBalance,
        message: 'Payment successful! Wallet credited.'
      });
    }

    await transaction.save();

    res.json({
      status: session.status,
      paymentStatus: session.payment_status,
      amount: transaction.amount
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

// Webhook endpoint (for production use)
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    const transaction = await Transaction.findOne({ sessionId: session.id });
    if (transaction && transaction.status !== 'completed') {
      const user = await User.findById(transaction.userId);
      user.walletBalance += transaction.amount;
      await user.save();

      transaction.status = 'completed';
      transaction.paymentStatus = 'paid';
      await transaction.save();
    }
  }

  res.json({ received: true });
});

// Get transaction history
router.get('/transactions', auth, checkRole('user'), async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(20);
  
  res.json({ transactions });
});

export default router;
