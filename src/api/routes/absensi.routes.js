import express from 'express';
import multer from 'multer';
import { prosesAbsensi, prosesIzin, getRiwayatAbsensi } from '../controllers/absensi.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/scan', prosesAbsensi);
router.post('/izin', upload.single('suratIzin'), prosesIzin);
router.get('/riwayat/:nisn', getRiwayatAbsensi);

export default router; 