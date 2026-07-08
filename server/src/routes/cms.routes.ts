import { Router } from 'express';
import {
  getCMSContent,
  updateCMSContent,
  getAllCMSContent,
} from '../controllers/cms.controller';
import { protect, requireRole } from '../middlewares/auth';

const router = Router();

// Publicly read configuration key-value
router.get('/', getAllCMSContent);
router.get('/:key', getCMSContent);

// Administrative modification (Admins and Editors only)
router.post('/:key', protect as any, requireRole(['ADMIN', 'EDITOR']) as any, updateCMSContent);

export default router;
