import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { uploadImage } from '../services/cloudinary.service';
import { protect, requireRole } from '../middlewares/auth';
import { BadRequestError } from '../utils/errors';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB maximum file size limit
  }
});

router.post(
  '/',
  protect as any,
  requireRole(['ADMIN', 'EDITOR']) as any,
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new BadRequestError('No image file uploaded');
      }
      
      const imageUrl = await uploadImage(req.file.buffer, 'products');
      
      res.status(200).json({
        status: 'success',
        data: { imageUrl }
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
