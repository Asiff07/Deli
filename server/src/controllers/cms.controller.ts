import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const getCMSContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;

    const content = await prisma.cMSContent.findUnique({
      where: { key },
    });

    if (!content) {
      throw new NotFoundError(`CMS Key '${key}' not found`);
    }

    res.status(200).json({
      status: 'success',
      data: { content },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCMSContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      throw new BadRequestError('Value payload is required');
    }

    const content = await prisma.cMSContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    res.status(200).json({
      status: 'success',
      data: { content },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCMSContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contents = await prisma.cMSContent.findMany();
    
    // Map as key-value pairs
    const configMap = contents.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, any>);

    res.status(200).json({
      status: 'success',
      data: { configMap },
    });
  } catch (error) {
    next(error);
  }
};
