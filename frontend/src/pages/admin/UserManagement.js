import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Users, Mail, Phone, Wallet, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { API_URL } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/users`);
      setUsers(data.users);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E65100] mx-auto mb-4"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-50">
      <nav className="border-b border-slate-800 bg-[#0F172A]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-heading">User Management</h1>
            <p className="text-sm text-slate-400">Total Users: {users.length}</p>
          </div>
          <Button onClick={() => navigate('/admin')} variant="ghost" data-testid="back-btn">
            ← Back to Dashboard
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {users.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-24 h-24 text-slate-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 font-heading">No Users Found</h2>
            <p className="text-slate-400">No users have registered yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {users.map((user, index) => (
              <div 
                key={user._id}
                className="bg-slate-900 rounded-2xl border border-slate-800 p-8 hover:border-[#E65100]/50 transition-all"
                data-testid={`user-${user._id}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-[#E65100] to-[#D4AF37] w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2 font-heading text-white">{user.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm font-mono">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm font-mono">{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            Joined: {new Date(user.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/30 text-green-400 border border-green-800">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-800">
                        <XCircle className="w-4 h-4" />
                        Not Verified
                      </span>
                    )}
                    
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E65100]/20 border border-[#E65100]/50">
                      <Wallet className="w-4 h-4 text-[#E65100]" />
                      <span className="text-sm font-mono font-bold text-[#E65100]">
                        ₹{user.walletBalance || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  <div className="text-sm text-slate-500 font-mono">
                    User ID: {user._id}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 text-slate-400 hover:bg-slate-800"
                      onClick={() => {
                        navigator.clipboard.writeText(user.email);
                        toast.success('Email copied to clipboard');
                      }}
                    >
                      Copy Email
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
