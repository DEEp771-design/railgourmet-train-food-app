import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Wallet as WalletIcon, Plus, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const PACKAGES = [
  { id: 'small', amount: 100, label: '₹100' },
  { id: 'medium', amount: 250, label: '₹250' },
  { id: 'large', amount: 500, label: '₹500' },
  { id: 'xlarge', amount: 1000, label: '₹1000' }
];

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { API_URL, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    if (sessionId && !processing) {
      checkPaymentStatus(sessionId);
    }
  }, [sessionId]);

  const fetchBalance = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/user/wallet`);
      setBalance(data.walletBalance);
    } catch (error) {
      toast.error('Failed to load wallet balance');
    }
  };

  const checkPaymentStatus = async (sessId) => {
    setProcessing(true);
    let attempts = 0;
    const maxAttempts = 5;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        toast.error('Payment verification timeout');
        setProcessing(false);
        return;
      }

      try {
        const { data } = await axios.get(`${API_URL}/api/payment/checkout/status/${sessId}`);
        
        if (data.paymentStatus === 'paid') {
          toast.success(`Payment successful! ₹${data.amount} added to wallet`);
          setBalance(data.walletBalance);
          updateUser({ walletBalance: data.walletBalance });
          setProcessing(false);
          navigate('/user/wallet', { replace: true });
        } else if (data.status === 'expired') {
          toast.error('Payment session expired');
          setProcessing(false);
        } else {
          attempts++;
          setTimeout(poll, 2000);
        }
      } catch (error) {
        toast.error('Failed to verify payment');
        setProcessing(false);
      }
    };

    poll();
  };

  const handleRecharge = async (packageId) => {
    setLoading(true);
    try {
      const originUrl = window.location.origin;
      const { data } = await axios.post(`${API_URL}/api/payment/checkout/session`, {
        packageId,
        originUrl
      });
      window.location.href = data.url;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create payment session');
      setLoading(false);
    }
  };

  if (processing) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 text-[#E65100] mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold mb-2 font-heading">Verifying Payment...</h2>
          <p className="text-slate-600">Please wait while we confirm your transaction</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <nav className="border-b border-slate-200 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-heading">My Wallet</h1>
          <Button onClick={() => navigate('/user')} variant="ghost">Back</Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#E65100] to-[#D4AF37] rounded-3xl p-8 text-white mb-12 shadow-2xl" data-testid="wallet-balance">
          <div className="flex items-center gap-3 mb-4">
            <WalletIcon className="w-8 h-8" />
            <span className="text-lg font-medium">Current Balance</span>
          </div>
          <p className="text-5xl font-black font-mono mb-2">₹{balance}</p>
          <p className="text-sm opacity-90">Available for orders</p>
        </div>

        {/* Recharge Options */}
        <h2 className="text-3xl font-bold mb-6 font-heading">Recharge Wallet</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {PACKAGES.map(pkg => (
            <div 
              key={pkg.id}
              className="bg-white rounded-2xl border-2 border-slate-200 p-8 hover:border-[#E65100] transition-all"
              data-testid={`package-${pkg.id}`}
            >
              <div className="text-center mb-6">
                <Plus className="w-12 h-12 text-[#E65100] mx-auto mb-3" />
                <p className="text-4xl font-black font-mono text-[#E65100]">{pkg.label}</p>
              </div>
              <Button 
                onClick={() => handleRecharge(pkg.id)}
                disabled={loading}
                data-testid={`recharge-${pkg.id}`}
                className="w-full bg-[#E65100] hover:bg-[#E65100]/90 rounded-full py-6 font-bold"
              >
                {loading ? 'Processing...' : 'Recharge Now'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}