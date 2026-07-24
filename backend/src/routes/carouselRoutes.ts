import { Router } from 'express';
import { getCarouselItems, createCarouselItem, deleteCarouselItem } from '../controllers/carouselController';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getCarouselItems);
router.post('/', authenticate, authorizeAdmin, createCarouselItem);
router.delete('/:id', authenticate, authorizeAdmin, deleteCarouselItem);

export default router;
