import React from 'react';
import { Link } from 'react-router-dom';
import { TrainFront, UtensilsCrossed, ShoppingBag, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('https://images.pexels.com/photos/32434396/pexels-photo-32434396.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/80 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-3 mb-6">
            <TrainFront className="w-12 h-12 text-[#E65100]" />
            <h1 className="text-5xl md:text-7xl font-black tracking-tight font-heading text-[#0F172A]">
              RailGourmet
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-2xl">
            Dining at 100km/h
          </p>
          <p className="text-base md:text-lg text-slate-500 mb-12 max-w-xl">
            Order delicious meals during your train journey. Fresh food delivered right to your seat.
          </p>
          <div className="flex gap-4">
            <Link to="/register">
              <Button 
                data-testid="get-started-btn"
                className="bg-[#E65100] hover:bg-[#E65100]/90 text-white rounded-full px-8 py-6 text-lg font-bold shadow-[0_4px_14px_0_rgba(230,81,0,0.39)] transition-transform active:scale-95"
              >
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                data-testid="login-btn"
                variant="outline" 
                className="border-2 border-[#E65100] text-[#E65100] hover:bg-[#E65100]/10 rounded-full px-8 py-6 text-lg font-bold"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 font-heading text-[#0F172A]">
            Why Choose RailGourmet?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
              <UtensilsCrossed className="w-12 h-12 text-[#E65100] mb-4" />
              <h3 className="text-2xl font-semibold mb-3 font-heading">Wide Variety</h3>
              <p className="text-slate-600">Choose from multiple restaurants and cuisines at every station.</p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
              <Clock className="w-12 h-12 text-[#E65100] mb-4" />
              <h3 className="text-2xl font-semibold mb-3 font-heading">Real-time Tracking</h3>
              <p className="text-slate-600">Track your order status from preparation to delivery.</p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
              <ShoppingBag className="w-12 h-12 text-[#E65100] mb-4" />
              <h3 className="text-2xl font-semibold mb-3 font-heading">Easy Payment</h3>
              <p className="text-slate-600">Secure wallet system for hassle-free transactions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">&copy; 2024 RailGourmet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}