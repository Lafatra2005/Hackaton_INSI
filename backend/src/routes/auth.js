import express from 'express';
import { register, login, getProfile, updateProfile, logout } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Routes publiques
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Routes protégées
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/logout', authenticateToken, logout);

export default router;