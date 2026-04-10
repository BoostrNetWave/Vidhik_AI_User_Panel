import express from 'express';
import { registerUser, loginUser, updateProfile } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.put('/profile', updateProfile as any);

export default router;
