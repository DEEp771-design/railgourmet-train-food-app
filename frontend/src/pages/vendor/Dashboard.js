import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { LogOut, Package, ShoppingBag, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function VendorDashboard() {
  const [stats, setStats] = useState({});
  const { user, logout, API_URL } = useAuth();

  useEffect(() => {
    if (!user?.isApproved) {
      toast.info('Your account is pending admin approval');
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/vendor/stats`);
      setStats(data.stats);
    } catch (error) {
      toast.error('Failed to load stats');
    }
  };

  if (!user?.isApproved) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <Package className="w-24 h-24 text-[#D4AF37] mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 font-heading">Account Pending Approval</h2>
          <p className="text-slate-600 mb-8">Your vendor account is currently under review by our admin team. You'll be notified once approved.</p>
          <Button onClick={logout} variant="outline" className="rounded-full">Logout</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <nav className="border-b border-slate-200 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-heading">{user.restaurantName}</h1>
            <p className="text-sm text-slate-600">{user.location}</p>
          </div>
          <Button onClick={logout} variant="ghost" data-testid="logout-btn">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold mb-8 font-heading">Dashboard</h2>
        
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <Package className="w-8 h-8 text-[#E65100] mb-3" />
            <p className="text-sm text-slate-600 mb-1">Food Items</p>
            <p className="text-3xl font-bold">{stats.totalItems || 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <ShoppingBag className="w-8 h-8 text-[#10B981] mb-3" />
            <p className="text-sm text-slate-600 mb-1">Total Orders</p>
            <p className="text-3xl font-bold">{stats.totalOrders || 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <TrendingUp className="w-8 h-8 text-[#D4AF37] mb-3" />
            <p className="text-sm text-slate-600 mb-1">Pending Orders</p>
            <p className="text-3xl font-bold">{stats.pendingOrders || 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <Star className="w-8 h-8 text-[#E65100] mb-3" />
            <p className="text-sm text-slate-600 mb-1">Avg Rating</p>
            <p className="text-3xl font-bold">{stats.avgRating?.toFixed(1) || '0.0'}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/vendor/food">
            <div className="group bg-white rounded-2xl border border-slate-200 p-8 transition-all hover:-translate-y-1 hover:shadow-xl" data-testid="food-management-link">
              <Package className="w-12 h-12 text-[#E65100] mb-4" />
              <h3 className="text-xl font-semibold mb-2 font-heading">Food Management</h3>
              <p className="text-sm text-slate-600">Manage your menu items</p>
            </div>
          </Link>
          <Link to="/vendor/orders">
            <div className="group bg-white rounded-2xl border border-slate-200 p-8 transition-all hover:-translate-y-1 hover:shadow-xl" data-testid="order-management-link">
              <ShoppingBag className="w-12 h-12 text-[#E65100] mb-4" />
              <h3 className="text-xl font-semibold mb-2 font-heading">Order Management</h3>
              <p className="text-sm text-slate-600">Track and update orders</p>
            </div>
          </Link>
          <Link to="/vendor/feedback">
            <div className="group bg-white rounded-2xl border border-slate-200 p-8 transition-all hover:-translate-y-1 hover:shadow-xl" data-testid="feedback-link">
              <Star className="w-12 h-12 text-[#E65100] mb-4" />
              <h3 className="text-xl font-semibold mb-2 font-heading">Feedback</h3>
              <p className="text-sm text-slate-600">View customer reviews</p>
            </div>
          </Link>
          <Link to="/vendor/profile">
            <div className="group bg-white rounded-2xl border border-slate-200 p-8 transition-all hover:-translate-y-1 hover:shadow-xl" data-testid="profile-link">
              <LogOut className="w-12 h-12 text-[#E65100] mb-4" />
              <h3 className="text-xl font-semibold mb-2 font-heading">Profile</h3>
              <p className="text-sm text-slate-600">Update your details</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}