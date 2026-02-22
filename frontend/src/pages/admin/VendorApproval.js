import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { CheckCircle, XCircle, Store } from 'lucide-react';
import { toast } from 'sonner';

export default function VendorApproval() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { API_URL } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/vendors`);
      setVendors(data.vendors);
    } catch (error) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_URL}/api/admin/vendors/${id}/approve`);
      toast.success('Vendor approved!');
      fetchVendors();
    } catch (error) {
      toast.error('Failed to approve vendor');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`${API_URL}/api/admin/vendors/${id}/reject`);
      toast.success('Vendor approval removed');
      fetchVendors();
    } catch (error) {
      toast.error('Failed to reject vendor');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-50">
      <nav className="border-b border-slate-800 bg-[#0F172A]/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-heading">Vendor Management</h1>
          <Button onClick={() => navigate('/admin')} variant="ghost">Back</Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 font-heading">All Vendors</h2>
        
        {vendors.length === 0 ? (
          <div className="text-center py-16">
            <Store className="w-24 h-24 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">No vendors registered yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {vendors.map(vendor => (
              <div 
                key={vendor._id}
                className="bg-slate-900 rounded-2xl border border-slate-800 p-8"
                data-testid={`vendor-${vendor._id}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 font-heading">{vendor.restaurantName}</h3>
                    <p className="text-slate-400 mb-1">{vendor.name}</p>
                    <p className="text-sm text-slate-500">{vendor.email}</p>
                    <p className="text-sm text-slate-500">{vendor.phone}</p>
                    <p className="text-sm text-slate-500 mt-2">📍 {vendor.location}</p>
                  </div>
                  <div>
                    {vendor.isApproved ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/30 text-green-400 border border-green-800">
                        <CheckCircle className="w-4 h-4" />
                        Approved
                      </span>
                    ) : vendor.isVerified ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-800">
                        ⏳ Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>

                {vendor.isVerified && (
                  <div className="flex gap-3 mt-6">
                    {!vendor.isApproved ? (
                      <Button
                        onClick={() => handleApprove(vendor._id)}
                        data-testid={`approve-${vendor._id}`}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Vendor
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleReject(vendor._id)}
                        data-testid={`reject-${vendor._id}`}
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-900/20 rounded-full"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Remove Approval
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
