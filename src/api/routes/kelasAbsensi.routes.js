import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getKelasAbsensi, getKelasAbsensiByDate } from '../controllers/kelasAbsensi.controller.js';

const router = express.Router();

// Get summary for today
router.get('/summary', authMiddleware, getKelasAbsensi);

// Get summary by date
router.get('/summary/date', authMiddleware, getKelasAbsensiByDate);

export default router; 