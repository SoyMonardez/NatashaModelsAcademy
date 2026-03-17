import { Router } from 'express';
import { getModels, getModelById, createModel, updateModel, deleteModel } from '../controllers/modelController';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getModels);
router.get('/:id', getModelById);
router.post('/', upload.array('images', 10), createModel);
router.put('/:id', upload.array('images', 10), updateModel);
router.delete('/:id', deleteModel);

export default router;
