import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { TrainFront } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const { login, API_URL } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, formData);
      login(data.user, data.token);
      toast.success('Login successful!');
      navigate(`/${data.user.role}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
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
          
          <h2 className="text-3xl font-bold mb-2 text-center font-heading">Welcome Back</h2>
          <p className="text-slate-600 mb-8 text-center">Login to your account</p>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            <div>
              <Label htmlFor="role">Login As</Label>
              <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                <SelectTrigger data-testid="role-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
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

            <Button 
              type="submit" 
              data-testid="submit-btn"
              disabled={loading}
              className="w-full bg-[#E65100] hover:bg-[#E65100]/90 text-white rounded-full py-6 font-bold shadow-[0_4px_14px_0_rgba(230,81,0,0.39)]"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="mt-6 text-center text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#E65100] font-semibold hover:underline">
              Register
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