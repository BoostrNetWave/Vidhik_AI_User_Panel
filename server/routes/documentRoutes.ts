import { Router } from 'express';
import {
    generateDocument,
    generateEmploymentContract,
    getDocumentTypes,
    saveDocument,
    getUserDocuments,
    getTrashedDocuments,
    deleteDocument,
    restoreDocument,
    permanentlyDeleteDocument,
    reviewDocument,
    uploadDocument
} from '../controllers/documentController';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware';
import { checkUserLimit } from '../middleware/limitMiddleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all available document types
router.get('/types', getDocumentTypes);

// Analyze a document using AI
router.post('/review', protect, checkUserLimit('reviews'), upload.single('file'), reviewDocument);

// Get all documents for a user
router.get('/user/:userId', protect, getUserDocuments);

// Get trashed documents for a user
router.get('/trash/:userId', protect, getTrashedDocuments);

// Restore a document
router.post('/restore/:id', protect, restoreDocument);

// Soft delete (move to trash)
router.delete('/:id', protect, deleteDocument);

// Permanent delete
router.delete('/permanent/:id', protect, permanentlyDeleteDocument);

// Unified document generation endpoint
router.post('/generate', protect, checkUserLimit('documents'), generateDocument);

// Save a generated document
router.post('/save', protect, saveDocument);

// Upload a document directly to workspace
router.post('/upload', protect, upload.single('file'), uploadDocument);

// Legacy endpoint for employment contracts (backward compatibility)
router.post('/generate-employment-contract', protect, checkUserLimit('documents'), generateEmploymentContract);

export default router;
