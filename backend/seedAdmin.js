import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME || 'test_database'
    });

    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@trainfood.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin already exists');
    } else {
      const admin = new Admin({
        email: 'admin@trainfood.com',
        password: 'Admin@123'
      });
      
      await admin.save();
      console.log('✅ Admin created successfully');
      console.log('📧 Email: admin@trainfood.com');
      console.log('🔑 Password: Admin@123');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
