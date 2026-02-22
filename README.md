# 🚂 RailGourmet - Train Food Order App

**Dining at 100km/h** - Order delicious meals during your train journey with real-time tracking and seamless payment.

![RailGourmet Banner](https://images.pexels.com/photos/32434396/pexels-photo-32434396.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=940)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [User Roles & Credentials](#user-roles--credentials)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

RailGourmet is a full-stack MERN application that revolutionizes food ordering during train journeys. The platform connects passengers with railway station restaurants, enabling seamless food ordering with PNR-based delivery tracking.

### Key Highlights
- 🍽️ Multi-vendor food marketplace
- 🚂 PNR & Train number based ordering
- 💳 Integrated wallet system with Stripe
- 📧 Email OTP verification (Resend)
- 📊 Real-time order tracking
- 👑 Admin approval workflow for vendors
- ⭐ Rating & feedback system

---

## ✨ Features

### 👥 User Module
- ✅ Email/OTP registration & verification
- 🔍 Browse restaurants by station
- 🛒 Cart management with local storage
- 💰 Wallet recharge via Stripe
- 📦 Order placement with PNR/Train details
- 📍 Real-time order tracking (4 stages)
- ⭐ Rate & review orders
- 👤 Profile management

### 🏪 Vendor Module
- ✅ Restaurant registration with OTP
- ⏳ Admin approval workflow
- 🍽️ Food menu management (CRUD)
- 📦 Order management with status updates
- 📊 Dashboard with analytics
- ⭐ Customer feedback viewing
- 👤 Profile & restaurant info update

### 👑 Admin Module
- ✅ Secure admin login
- ✔️ Vendor approval/rejection
- 👥 User management & monitoring
- 📝 Comment moderation (abuse detection)
- 📊 Platform statistics dashboard

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Component library
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Third-Party Integrations
- **Stripe** - Payment processing
- **Resend** - Email delivery (OTP)

---

## 📥 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- npm or yarn

### Clone Repository
```bash
git clone https://github.com/yourusername/railgourmet.git
cd railgourmet
```

### Install Dependencies

**Backend:**
```bash
cd backend
yarn install
```

**Frontend:**
```bash
cd frontend
yarn install
```

---

## 🔐 Environment Variables

### Backend (.env)
Create `/backend/.env`:
```env
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=railgourmet_db

# Server
PORT=8001
CORS_ORIGINS=*

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key

# Payment (Stripe)
STRIPE_API_KEY=sk_test_your_stripe_test_key
```

### Frontend (.env)
Create `/frontend/.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## 🚀 Running the Application

### Development Mode

**1. Start MongoDB:**
```bash
mongod --dbpath /path/to/data
```

**2. Start Backend:**
```bash
cd backend
node server.js
```
Backend runs on: `http://localhost:8001`

**3. Start Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:3000`

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Start Backend with PM2:**
```bash
cd backend
pm2 start server.js --name railgourmet-api
```

---

## 👤 User Roles & Credentials

### 🔑 Test Accounts

#### Admin
```
Email: admin@trainfood.com
Password: Admin@123
Role: Admin
```

#### Vendors (All Approved)
```
1. Delhi Dhaba
   Email: delhidhaba@example.com
   Password: Vendor@123
   Location: New Delhi Railway Station

2. Mumbai Express Kitchen
   Email: mumbaiexpress@example.com
   Password: Vendor@123
   Location: Mumbai Central Station

3. South Spice Corner
   Email: southspice@example.com
   Password: Vendor@123
   Location: Bangalore City Station
```

#### Users
```
1. Email: rahul@example.com
   Password: User@123
   Wallet: ₹500

2. Email: priya@example.com
   Password: User@123
   Wallet: ₹300

3. Email: dk1836411@gmail.com
   Password: Deepak@123
   Wallet: ₹1000
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8001/api
```

### Authentication Endpoints

#### Register User/Vendor
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "phone": "9876543210",
  "role": "user",
  // For vendors:
  "restaurantName": "My Restaurant",
  "location": "Station Name"
}
```

#### Verify OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "role": "user"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password@123",
  "role": "user"
}

Response:
{
  "message": "Login successful!",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "walletBalance": 0
  }
}
```

### User Endpoints (Requires Auth)

#### Get Restaurants
```http
GET /user/restaurants
Authorization: Bearer <token>
```

#### Get Food Items
```http
GET /user/food-items?search=biryani&category=Lunch&vendorId=xyz
Authorization: Bearer <token>
```

#### Place Order
```http
POST /user/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "foodItemId": "item_id",
      "quantity": 2
    }
  ],
  "pnr": "1234567890",
  "trainNumber": "12345"
}
```

### Vendor Endpoints (Requires Auth)

#### Add Food Item
```http
POST /vendor/food-items
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Butter Chicken",
  "description": "Creamy tomato curry",
  "price": 250,
  "category": "Lunch",
  "image": "https://image-url.com"
}
```

#### Update Order Status
```http
PUT /vendor/orders/:orderId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Preparing" // Pending | Preparing | On the way | Delivered
}
```

### Admin Endpoints (Requires Auth)

#### Approve Vendor
```http
PUT /admin/vendors/:vendorId/approve
Authorization: Bearer <token>
```

#### Get All Users
```http
GET /admin/users
Authorization: Bearer <token>
```

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: "user",
  isVerified: Boolean,
  walletBalance: Number,
  createdAt: Date
}
```

### Vendors Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  restaurantName: String,
  location: String,
  role: "vendor",
  isVerified: Boolean,
  isApproved: Boolean,
  createdAt: Date
}
```

### FoodItems Collection
```javascript
{
  _id: ObjectId,
  vendorId: ObjectId (ref: Vendor),
  name: String,
  description: String,
  price: Number,
  category: String (Breakfast|Lunch|Dinner|Snacks|Beverages|Desserts),
  image: String,
  available: Boolean,
  createdAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  vendorId: ObjectId (ref: Vendor),
  items: [{
    foodItemId: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  pnr: String,
  trainNumber: String,
  deliveryStatus: String (Pending|Preparing|On the way|Delivered),
  createdAt: Date
}
```

---

## 🧪 Testing

### Manual Testing
1. Register as user/vendor
2. Verify OTP from backend logs or email
3. Login with credentials
4. Test complete flow

### API Testing with cURL
```bash
# Login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@trainfood.com","password":"Admin@123","role":"admin"}'

# Get restaurants
curl -X GET http://localhost:8001/api/user/restaurants \
  -H "Authorization: Bearer <token>"
```

---

## 🚢 Deployment

### Environment Setup
1. Update environment variables for production
2. Use strong JWT_SECRET
3. Configure MongoDB Atlas or production DB
4. Add production domain to CORS_ORIGINS

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Deployment (PM2)
```bash
cd backend
pm2 start server.js --name railgourmet
pm2 startup
pm2 save
```

---

## 🎨 Design System

### Colors
- **Primary (Saffron Blaze)**: `#E65100`
- **Secondary (Midnight Rail)**: `#0F172A`
- **Accent (Antique Gold)**: `#D4AF37`
- **Background**: `#FDFBF7`

### Typography
- **Headings**: Playfair Display
- **Body**: Manrope
- **Monospace**: JetBrains Mono

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Deepak Kumar**
- Email: dk1836411@gmail.com

---

## 🙏 Acknowledgments

- Built with ❤️ using MERN Stack
- UI Components: Shadcn/UI
- Icons: Lucide React
- Email Service: Resend
- Payment Gateway: Stripe

---

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Email: dk1836411@gmail.com

---

**Happy Coding! 🚂**
