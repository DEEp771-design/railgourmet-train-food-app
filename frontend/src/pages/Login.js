import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { TrainFront, Mail, Lock, User as UserIcon } from 'lucide-react';

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
          <div className="flex items-center gap-3 mb-10 justify-center">
            <TrainFront className="w-12 h-12 text-[#E65100]" />
            <h1 className="text-5xl font-black font-heading text-[#0F172A]">RailGourmet</h1>
          </div>
          
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-10 shadow-xl">
            <h2 className="text-3xl font-bold mb-2 text-center font-heading text-[#0F172A]">Welcome Back</h2>
            <p className="text-slate-600 mb-8 text-center">Login to your account</p>

            <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
              <div>
                <Label htmlFor="role" className="flex items-center gap-2 mb-2">
                  <UserIcon className="w-4 h-4" />
                  Login As
                </Label>
                <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                  <SelectTrigger data-testid="role-select" className="h-12 rounded-xl border-2">
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
                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  data-testid="email-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="your@email.com"
                  className="h-12 rounded-xl border-2 focus:ring-2 focus:ring-[#E65100] focus:border-[#E65100]"
                />
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  data-testid="password-input"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-2 focus:ring-2 focus:ring-[#E65100] focus:border-[#E65100]"
                />
              </div>

              <Button 
                type="submit" 
                data-testid="submit-btn"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#E65100] to-[#D4AF37] hover:opacity-90 text-white rounded-full py-6 text-lg font-bold shadow-lg transition-all hover:-translate-y-1"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <p className="mt-8 text-center text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#E65100] font-bold hover:underline">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div 
        className="hidden lg:block flex-1 bg-cover bg-center relative"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1761477103792-fc535e837d7b')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/80 to-[#E65100]/60" />
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-5xl font-black mb-6 font-heading">Dining at 100km/h</h2>
            <p className="text-xl opacity-90">Experience seamless food ordering during your train journey</p>
          </div>
        </div>
      </div>
    </div>
  );
}