import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { supportTicketSchema } from '@lumen-x-deli/shared';
import { BadRequestError, NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors';
import { AuthenticatedRequest } from '../middlewares/auth';
import { sendSupportTicketEmail } from '../services/email.service';

export const createTicket = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const parseResult = supportTicketSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(parseResult.error.flatten().fieldErrors);
    }

    const { email, subject, category, message } = parseResult.data;

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: req.user?.id || null,
        email,
        subject,
        category,
        status: 'OPEN',
        messages: {
          create: [
            {
              senderId: req.user?.id || null,
              senderName: req.user?.name || 'Visitor',
              senderRole: req.user?.role || 'VISITOR',
              message,
            },
          ],
        },
      },
      include: { messages: true },
    });

    // Send transactional ticket email using Resend
    try {
      await sendSupportTicketEmail(email, category, subject, message);
    } catch (emailErr) {
      console.error('Error sending support ticket email:', emailErr);
      // Fail silently for user so database entry is still returned even if Resend API fails
    }

    res.status(201).json({
      status: 'success',
      data: { ticket },
    });
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorizedError();

    const tickets = await prisma.supportTicket.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } },
    });

    res.status(200).json({
      status: 'success',
      data: { tickets },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTickets = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorizedError();

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: { tickets },
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorizedError();

    const { id } = req.params;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // Verify ownership or agent clearance
    if (ticket.userId !== req.user.id && !['ADMIN', 'CUSTOMER_SUPPORT'].includes(req.user.role)) {
      throw new UnauthorizedError('You are not authorized to view this ticket');
    }

    res.status(200).json({
      status: 'success',
      data: { ticket },
    });
  } catch (error) {
    next(error);
  }
};

export const submitMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorizedError();

    const { id } = req.params;
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new BadRequestError('Message cannot be empty');
    }

    const ticket = await prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // Verify ownership or agent clearance
    const isAgent = ['ADMIN', 'CUSTOMER_SUPPORT'].includes(req.user.role);
    if (ticket.userId !== req.user.id && !isAgent) {
      throw new UnauthorizedError('You are not authorized to message on this ticket');
    }

    // Update status to IN_PROGRESS if agent replied, or leave OPEN if user replied
    const updatedStatus = isAgent ? 'IN_PROGRESS' : 'OPEN';

    const newMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        senderId: req.user.id,
        senderName: req.user.name,
        senderRole: req.user.role,
        message,
      },
    });

    await prisma.supportTicket.update({
      where: { id },
      data: {
        status: updatedStatus,
        updatedAt: new Date(),
      },
    });

    res.status(201).json({
      status: 'success',
      data: { message: newMessage },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // OPEN, IN_PROGRESS, RESOLVED, CLOSED

    if (!status || !['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(status)) {
      throw new BadRequestError('Invalid status');
    }

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      status: 'success',
      data: { ticket },
    });
  } catch (error) {
    next(error);
  }
};
