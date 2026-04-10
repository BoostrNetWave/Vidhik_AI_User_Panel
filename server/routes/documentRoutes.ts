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
    reviewDocument
} from '../controllers/documentController';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all available document types
router.get('/types', getDocumentTypes);

// Analyze a document using AI
router.post('/review', upload.single('file'), reviewDocument);

// Get all documents for a user
router.get('/user/:userId', getUserDocuments);

// Get trashed documents for a user
router.get('/trash/:userId', getTrashedDocuments);

// Restore a document
router.post('/restore/:id', restoreDocument);

// Soft delete (move to trash)
router.delete('/:id', deleteDocument);

// Permanent delete
router.delete('/permanent/:id', permanentlyDeleteDocument);

// Unified document generation endpoint
router.post('/generate', generateDocument);

// Save a generated document
router.post('/save', saveDocument);

// Legacy endpoint for employment contracts (backward compatibility)
router.post('/generate-employment-contract', generateEmploymentContract);

export default router;
