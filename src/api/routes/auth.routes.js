import express from 'express';
import { register, login, registerGuru } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/register/guru', registerGuru);

export default router; 