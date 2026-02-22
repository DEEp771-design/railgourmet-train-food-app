import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { LogOut, ShoppingCart, Wallet, User, Search, Store } from 'lucide-react';
import { toast } from 'sonner';

export default function UserHome() {
  const [restaurants, setRestaurants] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState('');
  const { user, logout, API_URL } = useAuth();
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
    fetchFoodItems();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/user/restaurants`);
      setRestaurants(data.restaurants);
    } catch (error) {
      toast.error('Failed to load restaurants');
    }
  };

  const fetchFoodItems = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/user/food-items`);
      setFoodItems(data.foodItems);
    } catch (error) {
      toast.error('Failed to load food items');
    }
  };

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/user/food-items?search=${search}`);
      setFoodItems(data.foodItems);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleAddToCart = (item) => {
    addToCart({
      foodItemId: item._id,
      name: item.name,
      price: item.price,
      vendorId: item.vendorId._id
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-heading text-[#E65100]">RailGourmet</h1>
          <div className="flex gap-4 items-center">
            <Link to="/user/wallet">
              <Button variant="ghost" size="icon" data-testid="wallet-btn">
                <Wallet className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/user/orders">
              <Button variant="ghost" size="icon" data-testid="orders-btn">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/user/cart">
              <Button variant="ghost" size="icon" className="relative" data-testid="cart-btn">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E65100] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>
            <Button onClick={logout} variant="ghost" size="icon" data-testid="logout-btn">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Search */}
      <div className="bg-gradient-to-br from-[#E65100]/10 to-transparent py-16 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4 font-heading">What's on your mind?</h2>
          <p className="text-lg text-slate-600 mb-8">Search for restaurants or food items</p>
          <div className="flex gap-2">
            <Input
              placeholder="Search food items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              data-testid="search-input"
              className="h-14 text-lg rounded-full border-2"
            />
            <Button 
              onClick={handleSearch}
              data-testid="search-btn"
              className="bg-[#E65100] hover:bg-[#E65100]/90 rounded-full px-8"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Restaurants */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-8 font-heading">Available Restaurants</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {restaurants.map(restaurant => (
              <Link key={restaurant._id} to={`/user/restaurant/${restaurant._id}`}>
                <div 
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl p-6"
                  data-testid={`restaurant-${restaurant._id}`}
                >
                  <Store className="w-12 h-12 text-[#E65100] mb-4" />
                  <h4 className="text-xl font-semibold mb-2 font-heading">{restaurant.restaurantName}</h4>
                  <p className="text-sm text-slate-600">{restaurant.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Food Items */}
        <div>
          <h3 className="text-3xl font-bold mb-8 font-heading">Browse Menu</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {foodItems.map(item => (
              <div 
                key={item._id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
                data-testid={`food-item-${item._id}`}
              >
                <div className="h-48 bg-gradient-to-br from-[#E65100]/20 to-[#D4AF37]/20 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">🍽️</span>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-mono uppercase tracking-wide text-slate-500">{item.vendorId?.restaurantName}</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-2 font-heading">{item.name}</h4>
                  <p className="text-sm text-slate-600 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold font-mono text-[#E65100]">₹{item.price}</p>
                    <Button 
                      onClick={() => handleAddToCart(item)}
                      data-testid={`add-to-cart-${item._id}`}
                      className="bg-[#E65100] hover:bg-[#E65100]/90 rounded-full"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
