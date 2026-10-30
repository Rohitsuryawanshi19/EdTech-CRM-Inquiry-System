import express from 'express';
import { login, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Login (generates custom JWT)
router.post('/login', login);

// Admin Profile verification (Protected route)
router.get('/me', authenticateToken, getMe);

export default router;
