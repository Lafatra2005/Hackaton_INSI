import express from 'express';
import { 
    getAllQuizzes, 
    getQuizById, 
    submitQuiz, 
    getUserResults, 
    getUserProgress 
} from '../controllers/quizController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/submit', authenticateToken, submitQuiz);
router.get('/results/my-results', authenticateToken, getUserResults);
router.get('/progress/my-progress', authenticateToken, getUserProgress);

export default router;