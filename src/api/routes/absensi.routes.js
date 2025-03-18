import express from 'express';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  prosesAbsensi,
  prosesIzin,
  getRiwayatAbsensi,
  getMyAbsensi,
  getRiwayatAbsensiByNIS,
  scanQRCode,
  getKelasAbsensi,
  getRiwayatAbsensiByWaliKelas,
  downloadRekapanSemester,
  processAlfa,
  getAbsensiPerKelas,
  downloadRekapanUsers
} from '../controllers/absensi.controller.js';
import { upload, uploadSuratIzin } from '../middleware/upload.middleware.js';

const router = express.Router();

// Gunakan path absolut untuk direktori upload
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'suratizin');

// Buat direktori jika belum ada
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Directory created:', uploadDir);
  }
} catch (err) {
  console.error('Error creating directory:', err);
}

router.post('/scan', prosesAbsensi);
router.post('/izin', authMiddleware, uploadSuratIzin.single('suratIzin'), prosesIzin);
router.get('/riwayat/:nisn', getRiwayatAbsensi);
router.get('/fetch', authMiddleware, getMyAbsensi);
router.get('/riwayat', authMiddleware, getRiwayatAbsensiByNIS);
router.post('/scan-qr', authMiddleware, scanQRCode);
router.get('/kelas/:kodeKelas', authMiddleware, getKelasAbsensi);
router.get('/wali-kelas/riwayat', authMiddleware, getRiwayatAbsensiByWaliKelas);
router.get('/rekapan-semester/download', authMiddleware, downloadRekapanSemester);

// New route for processing ALFA
router.post('/process-alfa/:kodeKelas', authMiddleware, processAlfa);

// Get attendance data grouped by class
router.get('/per-kelas', authMiddleware, getAbsensiPerKelas);

// Download user records (admin only)
router.get('/users/download', authMiddleware, downloadRekapanUsers);

export default router; 