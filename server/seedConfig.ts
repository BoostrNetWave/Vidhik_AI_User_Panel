import mongoose from 'mongoose';
import SystemConfig from './models/SystemConfig';
import './config/env'; // Load env variables

const seedData = [
    {
        key: 'LANDING_HERO_TITLE',
        value: 'Affordable Legal Services Powered by AI',
        category: 'landing',
        description: 'Main headline on the landing page'
    },
    {
        key: 'LANDING_HERO_SUBTITLE',
        value: 'Create legal documents, review contracts, and get legal help instantly using AI. Designed for startups, freelancers, and businesses.',
        category: 'landing',
        description: 'Subtitle text under the main headline'
    },
    {
        key: 'CONSULTATION_BASE_FEE',
        value: 500,
        category: 'payments',
        description: 'Default consultation fee for lawyers (in INR)'
    },
    {
        key: 'SYSTEM_MAINTENANCE_MODE',
        value: false,
        category: 'system',
        description: 'If true, the entire site shows a maintenance page'
    },
    {
        key: 'SUPPORT_CONTACT_EMAIL',
        value: 'support@vidhik.ai',
        category: 'system',
        description: 'Central support email displayed across all panels'
    }
];

const seedDatabase = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/user-admin2';
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        for (const data of seedData) {
            await SystemConfig.findOneAndUpdate(
                { key: data.key },
                data,
                { upsert: true, new: true }
            );
            console.log(`✅ Seeded/Updated: ${data.key}`);
        }

        console.log('\nDatabase seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
