import { Router } from 'express';
import { getCourses, getCourseById } from '../controllers/courseController';
import { optionalAuthenticate } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', optionalAuthenticate, getCourses);
router.get('/:id', optionalAuthenticate, getCourseById);

export default router;
