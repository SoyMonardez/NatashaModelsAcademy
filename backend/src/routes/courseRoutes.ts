import { Router } from 'express';
import { getCourses, getCourseById, createCourse, deleteCourse } from '../controllers/courseController';

const router = Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', createCourse);
router.delete('/:id', deleteCourse);

export default router;
