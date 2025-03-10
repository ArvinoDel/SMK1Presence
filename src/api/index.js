import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import barcodeRoutes from './routes/barcode.routes.js';
import absensiRoutes from './routes/absensi.routes.js';
import siswaRoutes from './routes/siswa.routes.js';
import guruRoutes from './routes/Guru.routes.js';
import adminRoutes from './routes/admin.routes.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initCronJobs } from './services/cronService.js';
import kelasAbsensiRoutes from './routes/kelasAbsensi.routes.js';
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: '*',  // Allow all origins during development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/barcode', barcodeRoutes);
app.use('/api/absensi', absensiRoutes);
app.use('/api/siswa', siswaRoutes);
app.use('/api/guru', guruRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/kelas-absensi', kelasAbsensiRoutes);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the public directory
app.use('/api/public', express.static(path.join(__dirname, 'public')));

// Serve static files dari subfolder
app.use('/uploads/profilepicture', express.static(path.join(process.cwd(), 'public/uploads/profilepicture')));
app.use('/uploads/suratizin', express.static(path.join(process.cwd(), 'public/uploads/suratizin')));
app.use('/uploads/surat', express.static(path.join(process.cwd(), 'public/uploads/surat')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Initialize cron jobs after DB connection
    initCronJobs();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
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
    message: 'Terjadi kesalahan internal server'
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log("Server is running on port 3000");
});

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/sw.js").then(() => {
//     console.log("Service Worker Registered");
//   });
// }