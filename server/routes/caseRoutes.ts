import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { 
    getCasesForClient, 
    getCaseById, 
    approvePlan, 
    hireLawyer 
} from '../controllers/caseController';

const router = Router();

router.use(protect);

router.get('/client', getCasesForClient);
router.post('/hire', hireLawyer);
router.get('/:id', getCaseById);
router.put('/:id/approve-plan', approvePlan);

export default router;
