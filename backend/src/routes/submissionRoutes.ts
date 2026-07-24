import { Router } from 'express';
import { getSubmissions, createSubmission, updateSubmissionStatus, deleteSubmission } from '../controllers/submissionController';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', createSubmission);
router.get('/', authenticate, authorizeAdmin, getSubmissions);
router.patch('/:id/status', authenticate, authorizeAdmin, updateSubmissionStatus);
router.delete('/:id', authenticate, authorizeAdmin, deleteSubmission);

export default router;
