import { Response } from 'express';
import Document from '../models/Document';
import Case from '../models/Case';
import User from '../models/User';
import UsageRecord from '../models/UsageRecord';
import SystemConfig from '../models/SystemConfig';

export const getDashboardStats = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;

        // 1. Total Documents generated (not trashed)
        const totalDocuments = await Document.countDocuments({
            userId,
            status: { $ne: 'trash' }
        });

        // 2. Pending Reviews (documents in draft status or without analysis results, and not trashed)
        const pendingReviews = await Document.countDocuments({
            userId,
            analysisResults: null,
            status: { $ne: 'trash' }
        });

        // 3. Active Consultations (cases where client is user and status is 'active')
        const activeConsultations = await Case.countDocuments({
            client: userId,
            status: 'active'
        });

        // 4. AI Credits and Subscription Plan details
        const user = await User.findById(userId).select('aiCredits subscription');
        const aiCredits = user ? user.aiCredits : 5000;
        const plan = user ? user.subscription : 'Free';

        // 5. Calculate monthly usage of subscription restricted features
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const docsUsage = await UsageRecord.countDocuments({
            userId,
            featureType: 'document_generation',
            createdAt: { $gte: startOfMonth }
        });

        const reviewsUsage = await UsageRecord.countDocuments({
            userId,
            featureType: 'document_review',
            createdAt: { $gte: startOfMonth }
        });

        const researchUsage = await UsageRecord.countDocuments({
            userId,
            featureType: 'legal_research',
            createdAt: { $gte: startOfDay }
        });

        const bookingsUsage = await UsageRecord.countDocuments({
            userId,
            featureType: 'lawyer_booking',
            createdAt: { $gte: startOfMonth }
        });

        // 6. Fetch user plan limits
        const userPlanName = user?.subscription || 'Free';
        const plansConfig = await SystemConfig.findOne({ key: 'USER_PRICING_PLANS' });
        let planLimits = { documents: 5, reviews: 2, research: 5, bookings: 1 };
        if (plansConfig && Array.isArray(plansConfig.value)) {
            const planDetails = plansConfig.value.find(
                (p: any) => p.name.toLowerCase() === userPlanName.toLowerCase()
            ) || plansConfig.value.find((p: any) => p.name.toLowerCase() === 'free');
            if (planDetails && planDetails.limits) {
                planLimits = {
                    documents: planDetails.limits.documents !== undefined ? Number(planDetails.limits.documents) : 5,
                    reviews: planDetails.limits.reviews !== undefined ? Number(planDetails.limits.reviews) : 2,
                    research: planDetails.limits.research !== undefined ? Number(planDetails.limits.research) : 5,
                    bookings: planDetails.limits.bookings !== undefined ? Number(planDetails.limits.bookings) : 1
                };
            }
        }

        res.json({
            success: true,
            data: {
                totalDocuments,
                pendingReviews,
                activeConsultations,
                aiCredits,
                plan,
                usage: {
                    documents: docsUsage,
                    reviews: reviewsUsage,
                    research: researchUsage,
                    bookings: bookingsUsage
                },
                limits: planLimits
            }
        });
    } catch (error: any) {
        console.error('[Dashboard Stats] Error:', error);
        res.status(500).json({
            error: 'Failed to fetch dashboard stats',
            message: error?.message || 'Unknown error'
        });
    }
};
