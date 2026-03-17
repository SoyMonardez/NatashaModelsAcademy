import { Router } from 'express';
import { handleContactSubmit } from '../controllers/emailController';

const router = Router();

// /api/emails/contact
router.post('/contact', handleContactSubmit);

export default router;
