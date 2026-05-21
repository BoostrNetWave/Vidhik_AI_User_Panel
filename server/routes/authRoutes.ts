import express from 'express';
import { registerUser, loginUser, updateProfile, verifyOTP, resendOTP } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.post('/verify-otp', verifyOTP as any);
router.post('/resend-otp', resendOTP as any);
router.put('/profile', updateProfile as any);

export default router;
