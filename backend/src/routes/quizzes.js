import express from 'express';
import { 
    getAllQuizzes, 
    getQuizById, 
    submitQuiz, 
    getUserResults, 
    getUserProgress,
    createQuiz 
} from '../controllers/quizController.js';
import { validateQuizSubmission } from '../middleware/validation.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Routes publiques
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);

// Routes protégées
router.post('/submit', authenticateToken, validateQuizSubmission, submitQuiz);
router.get('/results/my-results', authenticateToken, getUserResults);
router.get('/progress/my-progress', authenticateToken, getUserProgress);

// Routes admin/enseignant
router.post('/', authenticateToken, authorizeRoles('admin', 'enseignant'), createQuiz);

export default router;