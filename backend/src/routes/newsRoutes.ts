import { Router } from 'express';
import { getNews, createNews, updateNews, deleteNews } from '../controllers/newsController';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getNews);
router.post('/', authenticate, authorizeAdmin, upload.single('image'), createNews);
router.put('/:id', authenticate, authorizeAdmin, upload.single('image'), updateNews);
router.delete('/:id', authenticate, authorizeAdmin, deleteNews);

export default router;
