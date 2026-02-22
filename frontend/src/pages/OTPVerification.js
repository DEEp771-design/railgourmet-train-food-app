import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';
import { toast } from 'sonner';
import { TrainFront } from 'lucide-react';

export default function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, API_URL } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, role } = location.state || {};

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp, role });
      login(data.user, data.token);
      toast.success('Email verified successfully!');
      navigate(`/${data.user.role}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/resend-otp`, { email, role });
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#FDFBF7]">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <TrainFront className="w-10 h-10 text-[#E65100]" />
          <h1 className="text-4xl font-black font-heading">RailGourmet</h1>
        </div>
        
        <h2 className="text-3xl font-bold mb-2 text-center font-heading">Verify OTP</h2>
        <p className="text-slate-600 mb-8 text-center">Enter the 6-digit code sent to {email}</p>

        <div className="flex justify-center mb-8" data-testid="otp-input">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button 
          onClick={handleVerify}
          data-testid="verify-btn"
          disabled={loading || otp.length !== 6}
          className="w-full bg-[#E65100] hover:bg-[#E65100]/90 text-white rounded-full py-6 font-bold shadow-[0_4px_14px_0_rgba(230,81,0,0.39)] mb-4"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <Button 
          onClick={handleResend}
          data-testid="resend-btn"
          variant="ghost"
          className="w-full"
        >
          Resend OTP
        </Button>
      </div>
    </div>
  );
}