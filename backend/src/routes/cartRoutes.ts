import { Router } from 'express';
import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cartController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Base URL: /api/cart
router.get('/', authenticate, getCart);
router.post('/', authenticate, addToCart);
router.delete('/:modelId', authenticate, removeFromCart);
router.delete('/', authenticate, clearCart);

export default router;
