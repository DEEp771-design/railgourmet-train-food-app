import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

export default function Checkout() {
  const [pnr, setPnr] = useState('');
  const [trainNumber, setTrainNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { API_URL, user } = useAuth();
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const total = getTotal();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (user.walletBalance < total) {
      toast.error('Insufficient wallet balance!');
      navigate('/user/wallet');
      return;
    }

    setLoading(true);
    try {
      const items = cart.map(item => ({
        foodItemId: item.foodItemId,
        quantity: item.quantity
      }));

      await axios.post(`${API_URL}/api/user/orders`, {
        items,
        pnr,
        trainNumber
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/user/orders');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <nav className="border-b border-slate-200 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-heading">Checkout</h1>
          <Button onClick={() => navigate('/user/cart')} variant="ghost">Back</Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <form onSubmit={handlePlaceOrder} className="space-y-8" data-testid="checkout-form">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-2xl font-bold mb-6 font-heading">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {cart.map(item => (
                <div key={item.foodItemId} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-mono">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-xl font-semibold">Total</span>
              <span className="text-3xl font-bold font-mono text-[#E65100]" data-testid="total-amount">₹{total}</span>
            </div>
          </div>

          {/* Journey Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-2xl font-bold mb-6 font-heading">Journey Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pnr">PNR Number</Label>
                <Input
                  id="pnr"
                  data-testid="pnr-input"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value)}
                  required
                  placeholder="Enter 10-digit PNR"
                  className="h-14 font-mono text-lg rounded-lg border-2"
                  maxLength={10}
                />
              </div>
              <div>
                <Label htmlFor="trainNumber">Train Number</Label>
                <Input
                  id="trainNumber"
                  data-testid="train-number-input"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value)}
                  required
                  placeholder="Enter train number"
                  className="h-14 font-mono text-lg rounded-lg border-2"
                />
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-2xl font-bold mb-4 font-heading">Payment</h2>
            <div className="flex justify-between items-center mb-4">
              <span>Wallet Balance</span>
              <span className="font-mono font-bold">₹{user.walletBalance}</span>
            </div>
            {user.walletBalance < total && (
              <p className="text-red-600 text-sm">Insufficient balance. Please recharge your wallet.</p>
            )}
          </div>

          <Button 
            type="submit"
            data-testid="place-order-btn"
            disabled={loading || user.walletBalance < total}
            className="w-full bg-[#E65100] hover:bg-[#E65100]/90 rounded-full py-6 text-lg font-bold"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </form>
      </div>
    </div>
  );
}