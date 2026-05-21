import express from 'express';
import { getConfigs, updateConfig, getAllUsers, getPendingLawyers, approveLawyer, getPublicLawyers, verifyUser } from '../controllers/adminController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Admin Routes
 * Protected by 'protect' (JWT Check) and 'adminOnly' (Role Check)
 */

router.get('/config', protect, adminOnly, getConfigs);
router.put('/config', protect, adminOnly, updateConfig);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/pending-lawyers', protect, adminOnly, getPendingLawyers);
router.post('/approve-lawyer/:id', protect, adminOnly, approveLawyer);
router.post('/verify-user/:id', protect, adminOnly, verifyUser);

// Public routes (No auth required)
router.get('/public/config', getConfigs);
router.get('/public/lawyers', getPublicLawyers);

export default router;
