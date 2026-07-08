import { Router } from 'express';
import {
  createReview,
  getProductReviews,
  voteHelpful,
  addReply,
  softDeleteReview,
} from '../controllers/review.controller';
import { protect, requireRole } from '../middlewares/auth';

const router = Router();

// Retrieve reviews and write product reviews
router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect as any, createReview as any);

// Helpful voting
router.post('/:id/helpful', voteHelpful);

// Staff replies
router.post('/:id/reply', protect as any, requireRole(['ADMIN', 'EDITOR', 'CUSTOMER_SUPPORT']) as any, addReply as any);

// Mod deletion
router.delete('/:id', protect as any, softDeleteReview as any);

export default router;
