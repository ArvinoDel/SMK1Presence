import express from 'express';
import { prosesAbsensi } from '../controllers/absensi.controller.js';

const router = express.Router();

router.post('/scan', prosesAbsensi);

export default router; 