import express from 'express';
import { register, login, registerGuru } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes (hanya bisa diakses oleh admin)
router.post('/register/siswa', authMiddleware, register);
router.post('/register/guru', authMiddleware, registerGuru);

export default router; 