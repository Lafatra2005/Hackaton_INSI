import express from 'express';
import { register, login, logout, getProfile, updateProfile } from '../controllers/authController.js';
import { getUserStats } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/stats', authenticateToken, getUserStats);
router.post('/logout', authenticateToken, logout);

export default router;