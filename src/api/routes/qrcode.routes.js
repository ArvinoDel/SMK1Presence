import express from 'express';
import { generateQRCode, getMyQRCode } from '../controllers/qrcode.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js'; // Asumsi ada middleware auth

const router = express.Router();

// Generate QR Code untuk siswa yang login
router.post('/generate', authMiddleware, generateQRCode);

// Get QR Code siswa yang login
router.get('/my-qrcode', authMiddleware, getMyQRCode);

export default router; 