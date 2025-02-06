import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import barcodeRoutes from './routes/barcode.routes.js';
import absensiRoutes from './routes/absensi.routes.js';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/barcode', barcodeRoutes);
app.use('/api/absensi', absensiRoutes);


// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

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