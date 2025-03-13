import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import barcodeRoutes from './routes/barcode.routes.js';
import absensiRoutes from './routes/absensi.routes.js';
import siswaRoutes from './routes/siswa.routes.js';
import guruRoutes from './routes/Guru.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { initCronJobs } from './services/cronService.js';
import kelasAbsensiRoutes from './routes/kelasAbsensi.routes.js';
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production security headers
app.use(helmet());

// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// SSL configuration for production
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/api.muhfaz.my.id/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/api.muhfaz.my.id/fullchain.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/api.muhfaz.my.id/chain.pem')
};

// Middleware
const corsOptions = {
  origin: ['https://muhfaz.my.id', 'https://www.muhfaz.my.id'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

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

// Serve static files from the public directory with cache control
const staticOptions = {
  maxAge: '1d',
  etag: true
};
app.use('/api/public', express.static(path.join(__dirname, 'public'), staticOptions));
app.use('/uploads/profilepicture', express.static(path.join(process.cwd(), 'public/uploads/profilepicture'), staticOptions));
app.use('/uploads/suratizin', express.static(path.join(process.cwd(), 'public/uploads/suratizin'), staticOptions));
app.use('/uploads/surat', express.static(path.join(process.cwd(), 'public/uploads/surat'), staticOptions));

// Connect to MongoDB with additional security options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('Connected to MongoDB');
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

// Create both HTTP and HTTPS servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(sslOptions, app);

// Start the servers
httpServer.listen(80, '0.0.0.0', () => {
  console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, '0.0.0.0', () => {
  console.log('HTTPS Server running on port 443');
});

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/sw.js").then(() => {
//     console.log("Service Worker Registered");
//   });
// }