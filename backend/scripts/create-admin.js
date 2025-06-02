import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup to use ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to MongoDB - Fix: Use MONGO_URI instead of MONGODB_URI
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Import the User model
import userModel from '../models/user.model.js';

// Admin credentials
const adminData = {
  fullName: 'Admin User',
  email: 'anbru968@gmail.com',
  password: 'anbru7890',
  number: '1234567890', // Required field
  role: 'ADMIN',
  isEmailVerified: true, // Set to true to bypass email verification
  avatar: {
    public_id: 'admin-avatar',
    secure_url: ''
  }
};

// Create admin user
async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      // Update the existing admin
      existingAdmin.role = 'ADMIN';
      existingAdmin.isEmailVerified = true;
      
      // For existing user, we need to hash the password manually
      // since we're updating directly and not using the create method
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      existingAdmin.password = hashedPassword;
      
      await existingAdmin.save();
      console.log('Admin user updated successfully');
    } else {
      // For new user, the pre-save hook will handle password hashing
      const newAdmin = await userModel.create(adminData);
      console.log('Admin user created successfully:', newAdmin.email);
    }
    
    // Verify the user was created/updated with admin role
    const verifyAdmin = await userModel.findOne({ email: adminData.email });
    console.log('User role:', verifyAdmin.role);
    console.log('Email verified:', verifyAdmin.isEmailVerified);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.connection.close();
  }
}

// Run the function
createAdminUser();