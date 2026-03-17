import { Router } from 'express';
import { getSubmissions, createSubmission, updateSubmissionStatus, deleteSubmission } from '../controllers/submissionController';

const router = Router();

router.post('/', createSubmission);
router.get('/', getSubmissions);
router.patch('/:id/status', updateSubmissionStatus);
router.delete('/:id', deleteSubmission);

export default router;
