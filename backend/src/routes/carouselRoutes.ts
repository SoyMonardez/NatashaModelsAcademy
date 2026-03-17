import { Router } from 'express';
import { getCarouselItems, createCarouselItem, deleteCarouselItem } from '../controllers/carouselController';

const router = Router();

router.get('/', getCarouselItems);
router.post('/', createCarouselItem);
router.delete('/:id', deleteCarouselItem);

export default router;
