import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { createSupportTicket, getUserSupportTickets } from '../controllers/supportController';

const router = Router();

router.use(protect);

router.post('/', createSupportTicket);
router.get('/', getUserSupportTickets);

export default router;
