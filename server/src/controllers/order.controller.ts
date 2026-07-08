import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { checkoutSchema } from '@lumen-x-deli/shared';
import { BadRequestError, NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors';
import { AuthenticatedRequest } from '../middlewares/auth';
import { createCheckoutSession, verifyWebhookSignature } from '../services/stripe.service';
import { sendOrderConfirmationEmail } from '../services/email.service';

export const createOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorizedError();

    const parseResult = checkoutSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(parseResult.error.flatten().fieldErrors);
    }

    const { items, shippingAddress } = parseResult.data;

    let orderTotal = 0;
    const orderItemsData = [];

    // Verify stock and calculate final prices
    for (const item of items) {
      if (item.customBuildId) {
        // Custom build pricing verification
        const customBuild = await prisma.customBuild.findUnique({
          where: { id: item.customBuildId },
        });
        if (!customBuild) {
          throw new BadRequestError(`Custom build configuration ${item.customBuildId} not found`);
        }
        orderTotal += customBuild.price * item.quantity;
        orderItemsData.push({
          productId: item.productId,
          customBuildId: item.customBuildId,
          name: `${customBuild.category === 'LAMP' ? 'Custom 3D Lamp' : 'Custom Drone Part'} (${(customBuild.configuration as any).material}, ${(customBuild.configuration as any).color})`,
          price: customBuild.price,
          quantity: item.quantity,
        });
      } else if (item.variantId) {
        // Variant verification
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });
        if (!variant) {
          throw new BadRequestError(`Product variant ${item.variantId} not found`);
        }
        if (variant.stock < item.quantity) {
          throw new BadRequestError(`Insufficient stock for ${variant.name}. Available: ${variant.stock}`);
        }
        orderTotal += variant.price * item.quantity;
        orderItemsData.push({
          productId: item.productId,
          variantId: item.variantId,
          name: `${variant.product.name} - ${variant.name}`,
          price: variant.price,
          quantity: item.quantity,
        });

        // Deduct inventory
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        // Base product purchase
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) {
          throw new BadRequestError(`Product ${item.productId} not found`);
        }
        orderTotal += product.basePrice * item.quantity;
        orderItemsData.push({
          productId: item.productId,
          name: product.name,
          price: product.basePrice,
          quantity: item.quantity,
        });
      }
    }

    // Create Order in DB
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total: orderTotal,
        shippingAddress: shippingAddress as any,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true },
    });

    // Create Stripe Session
    const session = await createCheckoutSession(
      order.id,
      orderItemsData.map((oi) => ({ name: oi.name, price: oi.price, quantity: oi.quantity })),
      orderTotal,
      req.user.email
    );

    // Save paymentIntentId / session.id to Order
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntentId: session.id },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE_ORDER',
        details: `Created order ${order.id}. Redirect URL generated.`,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        order,
        checkoutUrl: session.url,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorizedError();

    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorizedError();

    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Check permissions (owner or admin/support)
    if (order.userId !== req.user.id && !['ADMIN', 'CUSTOMER_SUPPORT'].includes(req.user.role)) {
      throw new UnauthorizedError('You are not authorized to view this order');
    }

    res.status(200).json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // PENDING, PAID, PROCESSING, MANUFACTURING, SHIPPED, DELIVERED, CANCELLED

    if (!status) {
      throw new BadRequestError('Status is required');
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Revert inventory if order gets CANCELLED and was previously paid/processing
    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      for (const item of order.items) {
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    res.status(200).json({
      status: 'success',
      data: { order: updatedOrder },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Analytics calculations:
    // Total revenue from PAID orders
    // Count of users, orders, products, and support tickets
    // Recent orders feed
    
    const [totalRevenueResult, userCount, orderCount, productCount, openTicketCount, recentOrders] = await Promise.all([
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.supportTicket.count({ where: { status: 'OPEN' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    const totalRevenue = totalRevenueResult._sum.total || 0;

    res.status(200).json({
      status: 'success',
      data: {
        metrics: {
          totalRevenue,
          users: userCount,
          orders: orderCount,
          products: productCount,
          openTickets: openTicketCount,
        },
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Stripe Webhook handler
export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: any = null;

  try {
    if (signature && webhookSecret) {
      event = verifyWebhookSignature((req as any).rawBody, signature, webhookSecret);
    } else {
      // Mock webhook check (for testing fallback)
      const { orderId, status } = req.body;
      if (orderId && status === 'success') {
        event = {
          type: 'checkout.session.completed',
          data: {
            object: {
              client_reference_id: orderId,
              payment_intent: `mock_pi_${Date.now()}`,
            },
          },
        };
      }
    }

    if (!event) {
      return res.status(400).send('Webhook Secret or Signature missing, and no mock provided.');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.client_reference_id;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true },
      });

      if (order) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'PAID',
            status: 'PAID',
            paymentIntentId: session.payment_intent as string,
          },
        });

        // Send confirmation email
        await sendOrderConfirmationEmail(order.user.email, order.user.name, order.id, order.total);

        // Audit log
        await prisma.activityLog.create({
          data: {
            userId: order.userId,
            action: 'PAYMENT_SUCCESS',
            details: `Successful payment for order ${order.id}`,
          },
        });
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};
