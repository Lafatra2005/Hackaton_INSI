import express from 'express';
import { 
    analyzeContent, 
    getUserAnalyses, 
    getAnalysisById, 
    getAllAnalyses, 
    getAnalysisStats 
} from '../controllers/analysisController.js';
import { validateContentAnalysis } from '../middleware/validation.js';
import { authenticateToken, optionalAuth, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Route pour analyser du contenu (authentification optionnelle)
router.post('/analyze', optionalAuth, validateContentAnalysis, analyzeContent);

// Routes protégées
router.get('/my-analyses', authenticateToken, getUserAnalyses);
router.get('/analysis/:id', authenticateToken, getAnalysisById);

// Routes admin
router.get('/all-analyses', authenticateToken, authorizeRoles('admin'), getAllAnalyses);
router.get('/stats', authenticateToken, authorizeRoles('admin'), getAnalysisStats);

export default router;