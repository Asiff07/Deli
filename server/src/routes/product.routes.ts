import { Router, Request, Response, NextFunction } from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  createCustomBuild,
} from '../controllers/product.controller';
import { protect, requireRole, AuthenticatedRequest } from '../middlewares/auth';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'lumen_access_secret_key_1029384756';

// Optional auth helper to check if a user is logged in, but not block if they are not.
const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      isVerified: decoded.isVerified || false,
    };
  } catch (error) {
    // Ignore invalid tokens for optional auth
  }
  next();
};

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/custom-build', optionalAuth as any, createCustomBuild as any);

// Administrative operations
router.post('/', protect as any, requireRole(['ADMIN', 'EDITOR']) as any, createProduct);
router.patch('/:id', protect as any, requireRole(['ADMIN', 'EDITOR']) as any, updateProduct);
router.delete('/:id', protect as any, requireRole(['ADMIN']) as any, deleteProduct);

export default router;
