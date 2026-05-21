import mongoose from 'mongoose';
import User from './models/User';
import './config/env';

const createAdmin = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/user-admin2';
        await mongoose.connect(MONGO_URI);
        
        const email = 'admin@vidhik.ai';
        const existing = await User.findOne({ email });
        
        if (existing) {
            existing.role = 'admin';
            await existing.save();
            console.log('✅ Existing user promoted to Admin: admin@vidhik.ai');
        } else {
            await User.create({
                fullName: 'Super Admin',
                email: email,
                password: 'admin123', // This will be hashed by the model's pre-save hook
                role: 'admin'
            });
            console.log('✅ New Admin created: admin@vidhik.ai (Password: admin123)');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
