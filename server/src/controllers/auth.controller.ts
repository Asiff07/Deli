import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../config/db';
import { generateTokens, setTokenCookies, clearTokenCookies, AuthenticatedRequest } from '../middlewares/auth';
import { registerSchema, loginSchema, updateProfileSchema, resetPasswordRequestSchema, resetPasswordSchema } from '@lumen-x-deli/shared';
import { BadRequestError, UnauthorizedError, ValidationError } from '../utils/errors';
import { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(parseResult.error.flatten().fieldErrors);
    }

    const { name, email, password } = parseResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestError('A user with this email address already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user. Set first user as ADMIN for setup ease
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? 'ADMIN' : 'USER';

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        verificationToken,
      },
    });

    // Send emails (async non-blocking)
    sendWelcomeEmail(user.email, user.name).catch(console.error);
    sendVerificationEmail(user.email, user.name, verificationToken).catch(console.error);

    // Audit log
    await prisma.activityLog.create({
      data: { userId: user.id, action: 'REGISTER', details: 'User registered account' },
    });

    const tokens = generateTokens(user);
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(parseResult.error.flatten().fieldErrors);
    }

    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Incorrect email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Incorrect email or password');
    }

    // Audit log
    await prisma.activityLog.create({
      data: { userId: user.id, action: 'LOGIN', details: 'User logged in' },
    });

    const tokens = generateTokens(user);
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          avatarUrl: user.avatarUrl,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      await prisma.activityLog.create({
        data: { userId: req.user.id, action: 'LOGOUT', details: 'User logged out' },
      });
    }

    clearTokenCookies(res);

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Not logged in');
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      throw new BadRequestError('Verification token is missing or invalid');
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired verification token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
    });

    // Audit log
    await prisma.activityLog.create({
      data: { userId: user.id, action: 'VERIFY_EMAIL', details: 'Email verified' },
    });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully. You can now access full features.',
    });
  } catch (error) {
    next(error);
  }
};

export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = resetPasswordRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(parseResult.error.flatten().fieldErrors);
    }

    const { email } = parseResult.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return 200 even if email not found to prevent user enumeration attacks
      res.status(200).json({
        status: 'success',
        message: 'If that email address exists in our database, we have sent a recovery token.',
      });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    sendPasswordResetEmail(user.email, user.name, resetToken).catch(console.error);

    res.status(200).json({
      status: 'success',
      message: 'If that email address exists in our database, we have sent a recovery token.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseResult = resetPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(parseResult.error.flatten().fieldErrors);
    }

    const { token, password } = parseResult.data;

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestError('Reset token is invalid or has expired');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    await prisma.activityLog.create({
      data: { userId: user.id, action: 'RESET_PASSWORD', details: 'Password reset completed' },
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorizedError();

    const parseResult = updateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(parseResult.error.flatten().fieldErrors);
    }

    const { name, avatarUrl } = parseResult.data;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
      select: { id: true, email: true, name: true, role: true, isVerified: true, avatarUrl: true },
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
