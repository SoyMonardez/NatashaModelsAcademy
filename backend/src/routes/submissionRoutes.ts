import { Router } from 'express';
import { getSubmissions, updateSubmissionStatus, deleteSubmission } from '../controllers/submissionController';

const router = Router();

router.get('/', getSubmissions);
router.patch('/:id/status', updateSubmissionStatus);
router.delete('/:id', deleteSubmission);

export default router;
