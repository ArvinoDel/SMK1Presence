import express from 'express';
import {
  getAllGuru,
  getGuruById,
  createGuru,
  updateGuru,
  deleteGuru
} from '../controllers/Guru.controller.js';

const router = express.Router();

// GET all guru
router.get('/', getAllGuru);

// GET guru by ID
router.get('/:id', getGuruById);

// POST new guru
router.post('/', createGuru);

// PUT update guru
router.put('/:id', updateGuru);

// DELETE guru
router.delete('/:id', deleteGuru);

export default router; 