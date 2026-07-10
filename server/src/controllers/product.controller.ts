import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { BadRequestError, NotFoundError, ValidationError } from '../utils/errors';
import { customBuildSchema } from '@lumen-x-deli/shared';
import { AuthenticatedRequest } from '../middlewares/auth';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, sort, page = '1', limit = '12' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const whereClause: any = {};
    
    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Build sorting query
    let orderByClause: any = { createdAt: 'desc' };
    if (sort) {
      if (sort === 'price_asc') orderByClause = { basePrice: 'asc' };
      else if (sort === 'price_desc') orderByClause = { basePrice: 'desc' };
      else if (sort === 'rating_desc') orderByClause = { rating: 'desc' };
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: orderByClause,
        skip,
        take: limitNum,
        include: { variants: true },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      status: 'success',
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          pages: totalPages,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
        reviews: {
          where: { isSoftDeleted: false },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.status(200).json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, basePrice, category, images, specs, isCustomizable, variants, cadFileUrl } = req.body;

    if (!name || !slug || !description || !basePrice || !category) {
      throw new BadRequestError('Missing required fields');
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        basePrice: parseFloat(basePrice),
        category,
        images: images || [],
        specs: specs || {},
        isCustomizable: !!isCustomizable,
        cadFileUrl,
        variants: {
          create: (variants || []).map((v: any) => ({
            name: v.name,
            sku: v.sku,
            price: parseFloat(v.price),
            stock: parseInt(v.stock, 10) || 0,
            attributes: v.attributes || {},
          })),
        },
      },
      include: { variants: true },
    });

    res.status(201).json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, slug, description, basePrice, category, images, specs, isCustomizable, cadFileUrl } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(basePrice && { basePrice: parseFloat(basePrice) }),
        ...(category && { category }),
        ...(images && { images }),
        ...(specs && { specs }),
        ...(isCustomizable !== undefined && { isCustomizable }),
        ...(cadFileUrl !== undefined && { cadFileUrl }),
      },
    });

    res.status(200).json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Calculate and save custom 3D build configurations
export const createCustomBuild = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parseResult = customBuildSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(parseResult.error.flatten().fieldErrors);
    }

    const { category, material, color, size, finish, lighting, logoUrl, dimensions } = parseResult.data;

    // Custom Pricing Logic based on specs:
    // Base lamp: $89, Base drone frame: $120
    // Material multiplier: Carbon fiber: 1.5, Aluminum: 1.8, PETG: 1.0, Resin: 1.3
    // Finish adder: Anodized: $15, Carbon Gloss: $25, Matte: $0
    // Volume calculation: Length * Width * Height / 1000 * volumeFactor

    let basePrice = category === 'LAMP' ? 89 : 120;
    let materialMultiplier = 1.0;
    if (material.toLowerCase().includes('carbon')) materialMultiplier = 1.5;
    else if (material.toLowerCase().includes('aluminum')) materialMultiplier = 1.8;
    else if (material.toLowerCase().includes('resin') || material.toLowerCase().includes('glass')) materialMultiplier = 1.3;

    let finishCost = 0;
    if (finish.toLowerCase().includes('anodized') || finish.toLowerCase().includes('metal')) finishCost = 15;
    else if (finish.toLowerCase().includes('gloss')) finishCost = 10;

    let lightCost = lighting && lighting !== 'None' ? 15 : 0;

    // Volume multiplier
    const volume = dimensions.length * dimensions.width * dimensions.height;
    const volumeMultiplier = Math.max(0.5, Math.min(2.5, volume / 1000000)); // normalized scale

    const calculatedPrice = Math.round((basePrice * materialMultiplier * volumeMultiplier + finishCost + lightCost) * 100) / 100;

    const customBuild = await prisma.customBuild.create({
      data: {
        userId: req.user?.id || null,
        category,
        configuration: {
          material,
          color,
          size,
          finish,
          lighting: lighting || 'None',
          logoUrl: logoUrl || '',
          dimensions,
        },
        price: calculatedPrice,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        customBuild,
      },
    });
  } catch (error) {
    next(error);
  }
};
