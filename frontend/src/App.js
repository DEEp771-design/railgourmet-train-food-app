import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from './components/ui/sonner';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import VendorApproval from './pages/admin/VendorApproval';
import UserManagement from './pages/admin/UserManagement';
import CommentModeration from './pages/admin/CommentModeration';

// Vendor
import VendorDashboard from './pages/vendor/Dashboard';
import FoodManagement from './pages/vendor/FoodManagement';
import OrderManagement from './pages/vendor/OrderManagement';
import VendorFeedback from './pages/vendor/Feedback';
import VendorProfile from './pages/vendor/Profile';

// User
import UserHome from './pages/user/Home';
import Restaurant from './pages/user/Restaurant';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Orders from './pages/user/Orders';
import Wallet from './pages/user/Wallet';
import UserProfile from './pages/user/Profile';

import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/${user.role}`} /> : <Landing />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}`} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}`} />} />
      <Route path="/verify-otp" element={!user ? <OTPVerification /> : <Navigate to={`/${user.role}`} />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/vendors" element={<ProtectedRoute allowedRoles={['admin']}><VendorApproval /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
      <Route path="/admin/moderation" element={<ProtectedRoute allowedRoles={['admin']}><CommentModeration /></ProtectedRoute>} />

      {/* Vendor Routes */}
      <Route path="/vendor" element={<ProtectedRoute allowedRoles={['vendor']}><VendorDashboard /></ProtectedRoute>} />
      <Route path="/vendor/food" element={<ProtectedRoute allowedRoles={['vendor']}><FoodManagement /></ProtectedRoute>} />
      <Route path="/vendor/orders" element={<ProtectedRoute allowedRoles={['vendor']}><OrderManagement /></ProtectedRoute>} />
      <Route path="/vendor/feedback" element={<ProtectedRoute allowedRoles={['vendor']}><VendorFeedback /></ProtectedRoute>} />
      <Route path="/vendor/profile" element={<ProtectedRoute allowedRoles={['vendor']}><VendorProfile /></ProtectedRoute>} />

      {/* User Routes */}
      <Route path="/user" element={<ProtectedRoute allowedRoles={['user']}><UserHome /></ProtectedRoute>} />
      <Route path="/user/restaurant/:id" element={<ProtectedRoute allowedRoles={['user']}><Restaurant /></ProtectedRoute>} />
      <Route path="/user/cart" element={<ProtectedRoute allowedRoles={['user']}><Cart /></ProtectedRoute>} />
      <Route path="/user/checkout" element={<ProtectedRoute allowedRoles={['user']}><Checkout /></ProtectedRoute>} />
      <Route path="/user/orders" element={<ProtectedRoute allowedRoles={['user']}><Orders /></ProtectedRoute>} />
      <Route path="/user/wallet" element={<ProtectedRoute allowedRoles={['user']}><Wallet /></ProtectedRoute>} />
      <Route path="/user/profile" element={<ProtectedRoute allowedRoles={['user']}><UserProfile /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
