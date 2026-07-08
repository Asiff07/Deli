import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  updateProfile,
} from '../controllers/auth.controller';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect as any, logout as any);
router.get('/me', protect as any, getMe as any);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.patch('/profile', protect as any, updateProfile as any);

export default router;
