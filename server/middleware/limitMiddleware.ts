import { Response, NextFunction } from 'express';
import SystemConfig from '../models/SystemConfig';
import UsageRecord from '../models/UsageRecord';
import User from '../models/User';

export const checkUserLimit = (featureType: 'documents' | 'reviews' | 'research' | 'bookings') => {
    return async (req: any, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'User authentication required for limit check' });
            }

            const userId = req.user._id;
            
            // Get user profile to get their subscription
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userPlanName = user.subscription || 'Free';

            // Load pricing plans from SystemConfig
            const plansConfig = await SystemConfig.findOne({ key: 'USER_PRICING_PLANS' });
            if (!plansConfig || !Array.isArray(plansConfig.value)) {
                console.warn('[Limit Middleware] USER_PRICING_PLANS config not found in DB. Proceeding without limits.');
                return next();
            }

            // Find current plan
            const currentPlan = plansConfig.value.find(
                (p: any) => p.name.toLowerCase() === userPlanName.toLowerCase()
            ) || plansConfig.value.find(
                (p: any) => p.name.toLowerCase() === 'free'
            );

            if (!currentPlan) {
                console.warn(`[Limit Middleware] Plan "${userPlanName}" and fallback "Free" not found in config. Proceeding.`);
                return next();
            }

            // Extract the limit for this feature
            const limits = currentPlan.limits || {};
            const planLimit = limits[featureType] !== undefined ? Number(limits[featureType]) : 0;

            // Define time boundaries
            const now = new Date();
            let startDate: Date;
            let timeSpanText = 'month';

            if (featureType === 'research') {
                // Daily reset
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                timeSpanText = 'day';
            } else {
                // Monthly reset
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                timeSpanText = 'month';
            }

            // Map featureType parameter to featureType string in UsageRecord
            let usageRecordType = 'document_generation';
            if (featureType === 'reviews') usageRecordType = 'document_review';
            if (featureType === 'research') usageRecordType = 'legal_research';
            if (featureType === 'bookings') usageRecordType = 'lawyer_booking';

            // Count usage in the specified period
            const currentUsage = await UsageRecord.countDocuments({
                userId,
                featureType: usageRecordType,
                createdAt: { $gte: startDate }
            });

            console.log(`[Limit Check] User: ${user.fullName} (${userPlanName}), Feature: ${featureType}, Usage: ${currentUsage}/${planLimit} this ${timeSpanText}`);

            if (currentUsage >= planLimit) {
                return res.status(403).json({
                    error: 'limit_reached',
                    featureType,
                    limit: planLimit,
                    usage: currentUsage,
                    message: `You have reached the limit of ${planLimit} ${featureType} per ${timeSpanText} on your ${userPlanName} plan. Please upgrade your subscription to continue.`
                });
            }

            // Store current plan details on request for downstream usage
            req.userPlan = currentPlan;
            next();
        } catch (error: any) {
            console.error('[Limit Middleware] Error checking limit:', error);
            res.status(500).json({ message: 'Error checking subscription limit' });
        }
    };
};
