import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import barcodeRoutes from './routes/barcode.routes.js';
import absensiRoutes from './routes/absensi.routes.js';
import siswaRoutes from './routes/siswa.routes.js';
import guruRoutes from './routes/Guru.routes.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/barcode', barcodeRoutes);
app.use('/api/absensi', absensiRoutes);
app.use('/api/siswa', siswaRoutes);
app.use('/api/guru', guruRoutes);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}


// Serve static files from the public directory
app.use('/api/public', express.static(path.join(__dirname, 'public')));

// Serve static files dari subfolder
app.use('/uploads/profilepicture', express.static(path.join(process.cwd(), 'public/uploads/profilepicture')));
app.use('/uploads/surat', express.static(path.join(process.cwd(), 'public/uploads/surat')));


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Berhasil terhubung ke MongoDB');
  })
  .catch((error) => {
    console.error('Gagal terhubung ke MongoDB:', error);
  });

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route tidak ditemukan'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan internal server',
    error: err.message
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/sw.js").then(() => {
//     console.log("Service Worker Registered");
//   });
// }