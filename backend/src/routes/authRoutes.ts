import { Router } from 'express';
import { googleLogin, login, register } from '../controllers/authController';

const router = Router();

// /api/auth/google
router.post('/google', googleLogin);

// Manual Auth
router.post('/login', login);
router.post('/register', register);

export default router;
