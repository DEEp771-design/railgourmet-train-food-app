import React from 'react';
import { Link } from 'react-router-dom';
import { TrainFront, UtensilsCrossed, ShoppingBag, Clock, Star, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('https://images.pexels.com/photos/32434396/pexels-photo-32434396.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/90 to-[#FDFBF7]/40" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 min-h-screen flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <TrainFront className="w-14 h-14 md:w-16 md:h-16 text-[#E65100]" />
            <h1 className="text-6xl md:text-8xl font-black tracking-tight font-heading text-[#0F172A]">
              RailGourmet
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-[#E65100] font-bold mb-6 max-w-2xl">
            Dining at 100km/h
          </p>
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed">
            Order delicious meals during your train journey. Fresh food delivered right to your seat with real-time tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link to="/register">
              <Button 
                data-testid="get-started-btn"
                className="bg-[#E65100] hover:bg-[#E65100]/90 text-white rounded-full px-12 py-7 text-lg font-bold shadow-[0_8px_24px_0_rgba(230,81,0,0.4)] transition-all hover:shadow-[0_12px_32px_0_rgba(230,81,0,0.5)] hover:-translate-y-1 active:scale-95"
              >
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                data-testid="login-btn"
                variant="outline" 
                className="border-2 border-[#E65100] text-[#E65100] hover:bg-[#E65100]/10 rounded-full px-12 py-7 text-lg font-bold transition-all hover:-translate-y-1"
              >
                Login
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#10B981]" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#D4AF37]" />
              <span>Quality Food</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#E65100]" />
              <span>Real-time Tracking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 font-heading text-[#0F172A]">
              Why Choose RailGourmet?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience hassle-free dining on trains with our innovative platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="group relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-[#FDFBF7] p-10 transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-[#E65100]/50">
              <div className="bg-[#E65100]/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-10 h-10 text-[#E65100]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-heading text-[#0F172A]">Wide Variety</h3>
              <p className="text-slate-600 leading-relaxed">Choose from multiple restaurants and cuisines at every station. From local delicacies to popular chains.</p>
            </div>
            <div className="group relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-[#FDFBF7] p-10 transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-[#E65100]/50">
              <div className="bg-[#10B981]/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-10 h-10 text-[#10B981]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-heading text-[#0F172A]">Real-time Tracking</h3>
              <p className="text-slate-600 leading-relaxed">Track your order status from preparation to delivery. Know exactly when your food arrives at your seat.</p>
            </div>
            <div className="group relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-[#FDFBF7] p-10 transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-[#E65100]/50">
              <div className="bg-[#D4AF37]/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-10 h-10 text-[#D4AF37]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-heading text-[#0F172A]">Easy Payment</h3>
              <p className="text-slate-600 leading-relaxed">Secure wallet system for hassle-free transactions. Recharge once, order multiple times during your journey.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-24 px-6 bg-[#FDFBF7]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 font-heading text-[#0F172A]">
              How It Works
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { num: '1', title: 'Register', desc: 'Create your account in seconds' },
              { num: '2', title: 'Browse', desc: 'Explore restaurants and menus' },
              { num: '3', title: 'Order', desc: 'Enter PNR and place order' },
              { num: '4', title: 'Enjoy', desc: 'Food delivered to your seat' }
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-gradient-to-br from-[#E65100] to-[#D4AF37] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-lg">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-2 font-heading">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6 bg-gradient-to-br from-[#E65100] to-[#D4AF37] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 font-heading">
            Ready to Order?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied travelers enjoying delicious meals on their train journeys
          </p>
          <Link to="/register">
            <Button 
              className="bg-white text-[#E65100] hover:bg-white/90 rounded-full px-12 py-7 text-lg font-bold shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
            >
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <TrainFront className="w-8 h-8 text-[#E65100]" />
              <span className="text-2xl font-bold font-heading">RailGourmet</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-slate-400">© 2024 RailGourmet. All rights reserved.</p>
              <p className="text-xs text-slate-500 mt-1">Dining at 100km/h</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}