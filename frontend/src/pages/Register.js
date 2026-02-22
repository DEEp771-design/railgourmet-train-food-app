import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { TrainFront } from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '',
    restaurantName: '', location: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/register`, { ...formData, role });
      toast.success('Registration successful! Check your email for OTP.');
      navigate('/verify-otp', { state: { email: formData.email, role } });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#FDFBF7]">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <TrainFront className="w-10 h-10 text-[#E65100]" />
            <h1 className="text-4xl font-black font-heading">RailGourmet</h1>
          </div>
          
          <h2 className="text-3xl font-bold mb-2 text-center font-heading">Create Account</h2>
          <p className="text-slate-600 mb-8 text-center">Join us today</p>

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
            <div>
              <Label htmlFor="role">Register As</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger data-testid="role-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                data-testid="name-input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="h-12 rounded-lg border-2"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="email-input"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="h-12 rounded-lg border-2"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                data-testid="phone-input"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="h-12 rounded-lg border-2"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                data-testid="password-input"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="h-12 rounded-lg border-2"
              />
            </div>

            {role === 'vendor' && (
              <>
                <div>
                  <Label htmlFor="restaurantName">Restaurant Name</Label>
                  <Input
                    id="restaurantName"
                    data-testid="restaurant-input"
                    value={formData.restaurantName}
                    onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                    required
                    className="h-12 rounded-lg border-2"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    data-testid="location-input"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                    className="h-12 rounded-lg border-2"
                  />
                </div>
              </>
            )}

            <Button 
              type="submit" 
              data-testid="submit-btn"
              disabled={loading}
              className="w-full bg-[#E65100] hover:bg-[#E65100]/90 text-white rounded-full py-6 font-bold shadow-[0_4px_14px_0_rgba(230,81,0,0.39)]"
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>

          <p className="mt-6 text-center text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E65100] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <div 
        className="hidden lg:block flex-1 bg-cover bg-center relative"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1761477103792-fc535e837d7b')` }}
      >
        <div className="absolute inset-0 bg-[#0F172A]/60" />
      </div>
    </div>
  );
}