import { Router } from 'express';
import { googleLogin, login, register, updateProfile, requestPasswordReset, resetPassword } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// /api/auth/google
router.post('/google', googleLogin);

// Manual Auth
router.post('/login', login);
router.post('/register', register);

// Password reset for regular user accounts only.
router.post('/password-reset/request', requestPasswordReset);
router.post('/password-reset/confirm', resetPassword);

// Profile
router.put('/profile', authenticate, updateProfile);

export default router;
