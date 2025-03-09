import express from 'express';
import { registerAdmin, getProfile, updateProfile, getAllAdmins, getAllUsers, updateUser, deleteUser } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerAdmin);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/all', authMiddleware, getAllAdmins);
router.get('/users', authMiddleware, getAllUsers);
router.put('/users/:id', authMiddleware, updateUser);
router.delete('/users/:id', authMiddleware, deleteUser);

export default router; 