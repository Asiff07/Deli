import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Console logging for debugging
  console.error(`[ERROR] ${req.method} ${req.path} =>`, err);

  // If headers already sent, delegate to standard Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle custom ValidationError
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.statusCode >= 500 ? 'error' : 'fail',
      message: err.message,
    });
    return;
  }

  // Handle Zod parser directly if uncaught
  if (err.name === 'ZodError') {
    res.status(422).json({
      status: 'fail',
      message: 'Validation Failed',
      errors: err.errors ? err.errors.map((e: any) => ({ field: e.path.join('.'), message: e.message })) : err,
    });
    return;
  }

  // Handle Prisma Database Exceptions
  if (err.code) {
    // Prisma unique constraint violation
    if (err.code === 'P2002') {
      res.status(409).json({
        status: 'fail',
        message: `Duplicate field value: ${err.meta?.target || 'unknown target'}`,
      });
      return;
    }
    // Prisma record not found
    if (err.code === 'P2025') {
      res.status(404).json({
        status: 'fail',
        message: 'Resource not found or database record missing',
      });
      return;
    }
  }

  // Unhandled internal server errors
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Something went wrong',
  });
};
