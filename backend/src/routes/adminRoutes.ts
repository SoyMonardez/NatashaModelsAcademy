import { Router } from 'express';
import { getDashboardStats, getSettings, updateSetting, updateCourse } from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Dashboard
router.get('/stats', authenticate, authorizeAdmin, getDashboardStats);

// Settings
router.get('/settings', authenticate, authorizeAdmin, getSettings);
router.post('/settings', authenticate, authorizeAdmin, updateSetting);

// Courses
router.put('/courses/:id', authenticate, authorizeAdmin, updateCourse);

export default router;
