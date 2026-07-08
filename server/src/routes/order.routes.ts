import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderDetails,
  updateOrderStatus,
  getAnalytics,
  stripeWebhook,
} from '../controllers/order.controller';
import { protect, requireRole } from '../middlewares/auth';

const router = Router();

// Order list and create
router.post('/', protect as any, createOrder as any);
router.get('/', protect as any, getOrders as any);

// Analytics
router.get('/analytics', protect as any, requireRole(['ADMIN']) as any, getAnalytics as any);

// Specific order details and updates
router.get('/:id', protect as any, getOrderDetails as any);
router.patch('/:id', protect as any, requireRole(['ADMIN', 'CUSTOMER_SUPPORT']) as any, updateOrderStatus as any);

// Webhook endpoint (stripe will hit this directly)
router.post('/webhook', stripeWebhook);

export default router;
