import mongoose from 'mongoose';
import SystemConfig from './models/SystemConfig';
import User from './models/User';
import './config/env'; // Load env variables

const seedData = [
    {
        key: 'LANDING_HERO_TITLE',
        value: 'Affordable Legal Services',
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
        key: 'LANDING_LOGO_URL',
        value: '',
        category: 'landing',
        description: 'Custom URL for the landing page logo (leave empty to use default local logo)'
    },
    {
        key: 'LANDING_HERO_IMAGE',
        value: '',
        category: 'landing',
        description: 'Custom URL for the hero section dashboard image (leave empty to use default local image)'
    },
    {
        key: 'LANDING_HOW_IT_WORKS_STEPS',
        value: [
            { num: "01", title: "Choose Legal Service", desc: "Select from document generation, contract review, or legal Q&A.", iconName: "Zap" },
            { num: "02", title: "Fill Simple Details", desc: "Provide basic information through our guided forms.", iconName: "FileText" },
            { num: "03", title: "AI Generates Results", desc: "Get your document or legal answer instantly.", iconName: "Sparkles" }
        ],
        category: 'landing',
        description: 'JSON array of steps under the How It Works section'
    },
    {
        key: 'LANDING_FEATURES',
        value: [
            { iconName: "FileText", title: "AI Legal Document Generator", desc: "Create legal agreements in minutes with AI-powered templates.", color: "from-purple-500/20 to-violet-500/20" },
            { iconName: "ShieldCheck", title: "AI Contract Review", desc: "Upload contracts and detect risky clauses automatically.", color: "from-blue-500/20 to-indigo-500/20" },
            { iconName: "MessageSquare", title: "AI Legal Assistant", desc: "Ask legal questions and get instant, accurate answers.", color: "from-pink-500/20 to-rose-500/20" },
            { iconName: "Users", title: "Legal Consultation", desc: "Book verified lawyers online for expert guidance.", color: "from-emerald-500/20 to-teal-500/20" },
            { iconName: "Lock", title: "Secure Document Storage", desc: "Store and manage legal documents safely in the cloud.", color: "from-amber-500/20 to-orange-500/20" }
        ],
        category: 'landing',
        description: 'JSON array of core features displayed on the website'
    },
    {
        key: 'LANDING_PRICING_PLANS',
        value: [
            { name: "Free", priceMonthly: 0, priceYearly: 0, desc: "Perfect for trying out Vidhik AI", features: ["5 documents per month", "Basic AI chat", "Email support", "1 GB storage"], gradient: "from-slate-500 to-slate-600", popular: false, iconName: "Zap" },
            { name: "Pro", priceMonthly: 29, priceYearly: 290, desc: "Best for freelancers & startups", features: ["Unlimited documents", "AI contract review", "10 GB storage", "Priority support", "Document templates", "Export to PDF/Word"], gradient: "from-accent to-purple-500", popular: true, iconName: "Crown" },
            { name: "Business", priceMonthly: 79, priceYearly: 790, desc: "For teams & growing businesses", features: ["Everything in Pro", "Team access (up to 10)", "Task management", "Priority legal consultation", "Custom templates", "API access", "Dedicated account manager"], gradient: "from-indigo-500 to-blue-600", popular: false, iconName: "Building2" }
        ],
        category: 'landing',
        description: 'JSON array of pricing plans (used in both main page and pricing page)'
    },
    {
        key: 'LANDING_CONTACT_INFO',
        value: [
            { iconName: "Mail", title: "Email Support", detail: "support@vidhikai.com", desc: "We respond within 24 hours", color: "from-blue-500 to-indigo-600" },
            { iconName: "Building2", title: "Business Inquiries", detail: "business@vidhikai.com", desc: "Partnerships & enterprise", color: "from-purple-500 to-violet-600" },
            { iconName: "Phone", title: "Phone", detail: "+91 98765 43210", desc: "Mon-Fri, 9 AM - 6 PM IST", color: "from-emerald-500 to-teal-600" },
            { iconName: "MapPin", title: "Office", detail: "Bangalore, India", desc: "Koramangala, 5th Block", color: "from-amber-500 to-orange-600" }
        ],
        category: 'landing',
        description: 'JSON array of contact card items'
    },
    {
        key: 'LANDING_FAQS',
        value: [
            { q: "Is Vidhik AI a replacement for a lawyer?", a: "Vidhik AI is designed to assist with routine legal tasks like document generation and contract review. For complex legal matters, we recommend consulting with a qualified lawyer — and we can help you connect with one too." },
            { q: "How accurate are the AI-generated documents?", a: "Our documents are generated using advanced AI trained on thousands of legal templates and reviewed by legal professionals. We maintain a 98% accuracy rate across all document types." },
            { q: "Is my data secure on Vidhik AI?", a: "Absolutely. We use bank-grade encryption (AES-256) for all data storage and transfers. Your documents are private and never shared with third parties." },
            { q: "Can I customize the generated documents?", a: "Yes! All generated documents are fully editable. You can customize clauses, add sections, and tailor them to your specific needs before downloading." },
            { q: "What types of legal documents can I create?", a: "You can create NDAs, employment agreements, service contracts, rental agreements, partnership deeds, MOUs, privacy policies, terms of service, and many more." },
            { q: "Do you offer refunds?", a: "Yes, we offer a 7-day money-back guarantee on all paid plans. If you're not satisfied, contact our support team for a full refund." }
        ],
        category: 'landing',
        description: 'JSON array of FAQs shown on the main page, pricing, and contact pages'
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

const mockLawyers = [
    {
        fullName: "Adv. Rahul Sharma",
        email: "rahul.sharma@vidhikai.com",
        password: "lawyer123",
        role: "lawyer",
        isApproved: true,
        isVerified: true,
        expertise: "Corporate & Startup Law",
        experience: "10+ years",
        hourlyRate: 999,
        location: "Mumbai",
        rating: 4.8,
        reviews: 156,
        bio: "Specializing in corporate compliance, startup advisory, and funding agreements."
    },
    {
        fullName: "Adv. Priya Kapoor",
        email: "priya.kapoor@vidhikai.com",
        password: "lawyer123",
        role: "lawyer",
        isApproved: true,
        isVerified: true,
        expertise: "Family Law",
        experience: "8+ years",
        hourlyRate: 799,
        location: "Delhi",
        rating: 4.9,
        reviews: 203,
        bio: "Dedicated family law expert helping clients navigate sensitive matters with care."
    },
    {
        fullName: "Adv. Vikram Desai",
        email: "vikram.desai@vidhikai.com",
        password: "lawyer123",
        role: "lawyer",
        isApproved: true,
        isVerified: true,
        expertise: "Criminal Law",
        experience: "15+ years",
        hourlyRate: 1499,
        location: "Bangalore",
        rating: 4.7,
        reviews: 312,
        bio: "Veteran criminal trial lawyer with over 15 years in courts around India."
    },
    {
        fullName: "Adv. Anita Reddy",
        email: "anita.reddy@vidhikai.com",
        password: "lawyer123",
        role: "lawyer",
        isApproved: true,
        isVerified: true,
        expertise: "Intellectual Property",
        experience: "12+ years",
        hourlyRate: 1299,
        location: "Hyderabad",
        rating: 4.9,
        reviews: 178,
        bio: "Helping brands protect patents, trademarks, and copyright assets internationally."
    }
];

const seedDatabase = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/user-admin2';
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // 1. Seed configurations
        for (const data of seedData) {
            await SystemConfig.findOneAndUpdate(
                { key: data.key },
                data,
                { upsert: true, new: true }
            );
            console.log(`✅ Seeded/Updated Config: ${data.key}`);
        }

        // 2. Seed mock lawyers if none exist
        const lawyerCount = await User.countDocuments({ role: 'lawyer' });
        if (lawyerCount === 0) {
            console.log('No lawyers found in DB. Seeding mock verified lawyers...');
            for (const mock of mockLawyers) {
                await User.create(mock);
                console.log(`✅ Seeded Mock Lawyer: ${mock.fullName}`);
            }
        } else {
            console.log(`ℹ️ Skipping lawyer seeding: ${lawyerCount} lawyers already exist in database.`);
        }

        console.log('\nDatabase seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
