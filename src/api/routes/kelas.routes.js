import express from 'express';
import { getAllKelas, getKelasWithStudents } from '../controllers/kelas.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllKelas);
router.get('/with-students', authMiddleware, getKelasWithStudents);

export default router; 