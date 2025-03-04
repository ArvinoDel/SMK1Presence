import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { prosesAbsensi, prosesIzin, getRiwayatAbsensi, getMyAbsensi, getRiwayatAbsensiByNIS, scanQRCode } from '../controllers/absensi.controller.js';

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

// Konfigurasi multer untuk surat izin
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Pastikan direktori ada sebelum menyimpan file
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'surat-izin-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Tambahkan error handling untuk multer
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('suratIzin');

// Wrap upload middleware dengan error handling
const uploadMiddleware = (req, res, next) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: 'Error uploading file',
        error: err.message
      });
    } else if (err) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan internal server',
        error: err.message
      });
    }
    next();
  });
};

router.post('/scan', prosesAbsensi);
router.post('/izin', uploadMiddleware, prosesIzin);
router.get('/riwayat/:nisn', getRiwayatAbsensi);
router.get('/fetch', authMiddleware, getMyAbsensi);
router.get('/riwayat', authMiddleware, getRiwayatAbsensiByNIS);
router.post('/scan-qr', authMiddleware, scanQRCode);

export default router; 