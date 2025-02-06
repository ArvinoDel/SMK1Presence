import express from 'express';
import { generateBarcode, getMyBarcode } from '../controllers/barcode.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/generate', authMiddleware, generateBarcode);
router.get('/my-barcode', authMiddleware, getMyBarcode);

export default router; 