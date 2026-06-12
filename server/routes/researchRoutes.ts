import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { checkUserLimit } from '../middleware/limitMiddleware';
import { handleLegalResearch, getResearchHistory, saveResearch, deleteResearch, clearAllHistory } from '../controllers/researchController';

const router = Router();

router.use(protect);

// Perform new legal research
router.post('/', checkUserLimit('research'), handleLegalResearch);

// Get research history
router.get('/history', getResearchHistory);

// Clear all history
router.delete('/history/clear', clearAllHistory);

// Save research result
router.post('/save', saveResearch);

// Delete research record
router.delete('/:id', deleteResearch);

export default router;
