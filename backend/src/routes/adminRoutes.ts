import { Router } from 'express';
import { getDashboardStats, getSettings, updateSetting } from '../controllers/adminController';
import { createCourse, updateCourse, deleteCourse } from '../controllers/courseController';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Dashboard
router.get('/stats', authenticate, authorizeAdmin, getDashboardStats);

// Settings
router.get('/settings', getSettings); // Public
router.post('/settings', authenticate, authorizeAdmin, updateSetting); // Protected

// Courses (Admin Management)
router.post('/courses', authenticate, authorizeAdmin, createCourse);
router.put('/courses/:id', authenticate, authorizeAdmin, updateCourse);
router.delete('/courses/:id', authenticate, authorizeAdmin, deleteCourse);

export default router;
