import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { UserRole } from '@lumen-x-deli/shared';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'lumen_access_secret_key_1029384756';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'lumen_refresh_secret_key_5647382910';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isVerified: boolean;
  };
}

export const generateTokens = (user: { id: string; email: string; name: string; role: string }) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearTokenCookies = (res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let accessToken = req.cookies.accessToken;

    // Optional: Allow Authorization header as fallback
    if (!accessToken && req.headers.authorization?.startsWith('Bearer')) {
      accessToken = req.headers.authorization.split(' ')[1];
    }

    if (!accessToken) {
      // If access token is missing, attempt to refresh automatically using refresh token
      await handleTokenRefresh(req, res, next);
      return;
    }

    try {
      const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET) as any;
      
      // Fetch user from DB to verify status and role
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true, isVerified: true },
      });

      if (!user) {
        throw new UnauthorizedError('User belonging to this token no longer exists.');
      }

      req.user = user as any;
      return next();
    } catch (err: any) {
      // Access token might be expired. Try to use refresh token.
      if (err.name === 'TokenExpiredError') {
        await handleTokenRefresh(req, res, next);
        return;
      }
      throw new UnauthorizedError('Invalid access token');
    }
  } catch (error) {
    next(error);
  }
};

const handleTokenRefresh = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new UnauthorizedError('Authentication required. Session expired or missing tokens.');
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, isVerified: true },
    });

    if (!user) {
      throw new UnauthorizedError('User no longer exists');
    }

    // Generate new tokens
    const tokens = generateTokens(user);
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    req.user = user as any;
    return next();
  } catch (error) {
    clearTokenCookies(res);
    throw new UnauthorizedError('Invalid or expired refresh token. Please sign in again.');
  }
};

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('You do not have permission to perform this action');
    }

    next();
  };
};
