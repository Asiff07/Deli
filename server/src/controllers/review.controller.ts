import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { reviewSchema, reviewReplySchema } from '@lumen-x-deli/shared';
import { BadRequestError, NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors';
import { AuthenticatedRequest } from '../middlewares/auth';

const updateProductRating = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: { productId, isSoftDeleted: false },
    select: { rating: true },
  });

  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10
      : 0;

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: averageRating,
      reviewCount: reviewCount,
    },
  });
};

export const createReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorizedError();

    const { productId } = req.params;
    const parseResult = reviewSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(parseResult.error.flatten().fieldErrors);
    }

    const { rating, comment, images, videoUrl } = parseResult.data;

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Check if user already reviewed
    const existingReview = await prisma.review.findFirst({
      where: { productId, userId: req.user.id, isSoftDeleted: false },
    });
    if (existingReview) {
      throw new BadRequestError('You have already submitted a review for this product');
    }

    // Check if verified purchase (user has PAID order containing this productId)
    const paidOrder = await prisma.order.findFirst({
      where: {
        userId: req.user.id,
        paymentStatus: 'PAID',
        items: {
          some: { productId },
        },
      },
    });

    const isVerifiedPurchase = !!paidOrder;

    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user.id,
        userName: req.user.name,
        rating,
        comment,
        images: images || [],
        videoUrl: videoUrl || null,
        isVerifiedPurchase,
      },
    });

    // Update aggregate product reviews
    await updateProductRating(productId);

    res.status(201).json({
      status: 'success',
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId, isSoftDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: { reviews },
    });
  } catch (error) {
    next(error);
  }
};

export const voteHelpful = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.update({
      where: { id },
      data: {
        helpfulVotes: { increment: 1 },
      },
    });

    res.status(200).json({
      status: 'success',
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

export const addReply = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorizedError();

    const { id } = req.params; // Review ID
    const parseResult = reviewReplySchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(parseResult.error.flatten().fieldErrors);
    }

    const { comment } = parseResult.data;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    const reply = await prisma.reviewReply.create({
      data: {
        reviewId: id,
        userId: req.user.id,
        userName: req.user.name,
        userRole: req.user.role,
        comment,
      },
    });

    // We can also fetch the updated review object
    const updatedReview = await prisma.review.findUnique({
      where: { id },
      include: { replies: true },
    });

    res.status(201).json({
      status: 'success',
      data: { review: updatedReview },
    });
  } catch (error) {
    next(error);
  }
};

export const softDeleteReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorizedError();

    const { id } = req.params;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    // Authorization: owner or admin/super_admin
    if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new UnauthorizedError('You are not authorized to delete this review');
    }

    await prisma.review.update({
      where: { id },
      data: { isSoftDeleted: true },
    });

    await updateProductRating(review.productId);

    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
