import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../../components/ui/button';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-slate-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4 font-heading">Your cart is empty</h2>
          <Link to="/user">
            <Button className="bg-[#E65100] hover:bg-[#E65100]/90 rounded-full px-8" data-testid="browse-btn">
              Browse Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <nav className="border-b border-slate-200 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-heading">My Cart</h1>
          <Link to="/user">
            <Button variant="ghost">Back to Menu</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-4 mb-8">
          {cart.map(item => (
            <div 
              key={item.foodItemId}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between"
              data-testid={`cart-item-${item.foodItemId}`}
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold font-heading mb-1">{item.name}</h3>
                <p className="text-lg font-mono text-[#E65100]">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => updateQuantity(item.foodItemId, item.quantity - 1)}
                    data-testid={`decrease-qty-${item.foodItemId}`}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-mono font-bold" data-testid={`qty-${item.foodItemId}`}>
                    {item.quantity}
                  </span>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => updateQuantity(item.foodItemId, item.quantity + 1)}
                    data-testid={`increase-qty-${item.foodItemId}`}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => { removeFromCart(item.foodItemId); toast.success('Item removed'); }}
                  data-testid={`remove-${item.foodItemId}`}
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold">Total Amount</span>
            <span className="text-3xl font-bold font-mono text-[#E65100]" data-testid="total-amount">₹{getTotal()}</span>
          </div>
          <Link to="/user/checkout">
            <Button 
              className="w-full bg-[#E65100] hover:bg-[#E65100]/90 rounded-full py-6 text-lg font-bold"
              data-testid="checkout-btn"
            >
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}