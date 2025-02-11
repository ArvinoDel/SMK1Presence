import express from 'express';
import { getProfile, updateProfile } from '../controllers/siswa.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', 
  authMiddleware, 
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
  ]), 
  updateProfile
);

export default router; 