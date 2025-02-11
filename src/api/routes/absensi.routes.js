import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { prosesAbsensi, prosesIzin, getRiwayatAbsensi, getMyAbsensi } from '../controllers/absensi.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/scan', prosesAbsensi);
router.post('/izin', upload.single('suratIzin'), prosesIzin);
router.get('/riwayat/:nisn', getRiwayatAbsensi);
router.get('/fetch', authMiddleware, getMyAbsensi);

export default router; 