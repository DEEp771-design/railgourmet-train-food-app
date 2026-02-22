import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { LogOut, Users, Store, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const { logout, API_URL } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/stats`);
      setStats(data.stats);
    } catch (error) {
      toast.error('Failed to load stats');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-50">
      <nav className="border-b border-slate-800 bg-[#0F172A]/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-heading">Admin Dashboard</h1>
          <Button onClick={logout} variant="ghost" data-testid="logout-btn">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold mb-8 font-heading">Overview</h2>
        
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="relative overflow-hidden rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
            <Users className="w-8 h-8 text-[#E65100] mb-3" />
            <p className="text-sm text-slate-400 mb-1">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers || 0}</p>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
            <Store className="w-8 h-8 text-[#10B981] mb-3" />
            <p className="text-sm text-slate-400 mb-1">Approved Vendors</p>
            <p className="text-3xl font-bold">{stats.totalVendors || 0}</p>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
            <Store className="w-8 h-8 text-[#D4AF37] mb-3" />
            <p className="text-sm text-slate-400 mb-1">Pending Approvals</p>
            <p className="text-3xl font-bold">{stats.pendingVendors || 0}</p>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
            <MessageSquare className="w-8 h-8 text-[#E65100] mb-3" />
            <p className="text-sm text-slate-400 mb-1">Total Feedback</p>
            <p className="text-3xl font-bold">{stats.totalFeedback || 0}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/admin/vendors">
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[#E65100]/50" data-testid="vendor-approval-link">
              <Store className="w-12 h-12 text-[#E65100] mb-4" />
              <h3 className="text-2xl font-semibold mb-3 font-heading">Vendor Approval</h3>
              <p className="text-slate-400">Review and approve vendor registrations</p>
            </div>
          </Link>
          <Link to="/admin/users">
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[#E65100]/50" data-testid="user-management-link">
              <Users className="w-12 h-12 text-[#E65100] mb-4" />
              <h3 className="text-2xl font-semibold mb-3 font-heading">User Management</h3>
              <p className="text-slate-400">View and manage user accounts</p>
            </div>
          </Link>
          <Link to="/admin/moderation">
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[#E65100]/50" data-testid="moderation-link">
              <MessageSquare className="w-12 h-12 text-[#E65100] mb-4" />
              <h3 className="text-2xl font-semibold mb-3 font-heading">Comment Moderation</h3>
              <p className="text-slate-400">Review and remove abusive comments</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}