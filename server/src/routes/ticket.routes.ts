import { Router, Request, Response, NextFunction } from 'express';
import {
  createTicket,
  getTickets,
  getMyTickets,
  getTicketDetails,
  submitMessage,
  updateTicketStatus,
} from '../controllers/ticket.controller';
import { protect, requireRole, AuthenticatedRequest } from '../middlewares/auth';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'lumen_access_secret_key_1029384756';

const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      isVerified: decoded.isVerified || false,
    };
  } catch (error) {}
  next();
};

// Create tickets (anonymous and registered users allowed)
router.post('/', optionalAuth as any, createTicket as any);

// User lists his own tickets
router.get('/my', protect as any, getMyTickets as any);

// Admin view all tickets
router.get('/admin', protect as any, requireRole(['ADMIN', 'CUSTOMER_SUPPORT']) as any, getTickets as any);

// Detailed actions
router.get('/:id', protect as any, getTicketDetails as any);
router.post('/:id/message', protect as any, submitMessage as any);
router.patch('/:id/status', protect as any, requireRole(['ADMIN', 'CUSTOMER_SUPPORT']) as any, updateTicketStatus as any);

export default router;
