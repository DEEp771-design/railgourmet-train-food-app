import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Clock, CheckCircle, Truck, Package } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_ICONS = {
  'Pending': Clock,
  'Preparing': Package,
  'On the way': Truck,
  'Delivered': CheckCircle
};

const STATUS_COLORS = {
  'Pending': 'text-yellow-600 bg-yellow-100',
  'Preparing': 'text-blue-600 bg-blue-100',
  'On the way': 'text-purple-600 bg-purple-100',
  'Delivered': 'text-green-600 bg-green-100'
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { API_URL } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/user/orders`);
      setOrders(data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <nav className="border-b border-slate-200 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-heading">My Orders</h1>
          <Button onClick={() => navigate('/user')} variant="ghost">Back to Home</Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-24 h-24 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 font-heading">No orders yet</h2>
            <Button onClick={() => navigate('/user')} className="bg-[#E65100] hover:bg-[#E65100]/90 rounded-full px-8">
              Start Ordering
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const StatusIcon = STATUS_ICONS[order.deliveryStatus];
              return (
                <div 
                  key={order._id}
                  className="bg-white rounded-2xl border border-slate-200 p-8"
                  data-testid={`order-${order._id}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm text-slate-500 mb-1 font-mono">Order ID: {order._id.slice(-8)}</p>
                      <p className="text-sm text-slate-500 font-mono">PNR: {order.pnr} | Train: {order.trainNumber}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${STATUS_COLORS[order.deliveryStatus]}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="font-semibold text-sm" data-testid={`status-${order._id}`}>{order.deliveryStatus}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="font-mono">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold font-mono text-[#E65100]">₹{order.totalAmount}</span>
                  </div>

                  {order.deliveryStatus === 'Delivered' && (
                    <Button 
                      onClick={() => navigate('/user/feedback', { state: { orderId: order._id } })}
                      className="w-full mt-4 border-2 border-[#E65100] text-[#E65100] hover:bg-[#E65100]/10 rounded-full"
                      variant="outline"
                    >
                      Rate & Review
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}