import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters long' }),
  addressLine1: z.string().min(5, { message: 'Address must be at least 5 characters long' }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State/Province is required' }),
  postalCode: z.string().min(3, { message: 'Postal/Zip code must be at least 3 characters' }),
  country: z.string().min(2, { message: 'Country is required' }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please provide a valid E.164 phone number' }),
});

export const customBuildSchema = z.object({
  category: z.enum(['LAMP', 'DRONE']),
  material: z.string().min(1, { message: 'Material is required' }),
  color: z.string().min(1, { message: 'Color is required' }),
  size: z.string().min(1, { message: 'Size descriptor is required' }),
  finish: z.string().min(1, { message: 'Finish description is required' }),
  lighting: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
  }),
});

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  customBuildId: z.string().optional(),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, { message: 'Your cart is empty' }),
  shippingAddress: addressSchema,
  couponCode: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5, { message: 'Rating must be between 1 and 5 stars' }),
  comment: z.string().min(10, { message: 'Review comment must be at least 10 characters long' }),
  images: z.array(z.string().url()).optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
});

export const reviewReplySchema = z.object({
  comment: z.string().min(3, { message: 'Reply must be at least 3 characters long' }),
});

export const supportTicketSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters long' }),
  category: z.enum(['ORDER', 'CUSTOM_BUILD', 'TECHNICAL', 'GENERAL']),
  message: z.string().min(10, { message: 'Please detail your request in at least 10 characters' }),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type CustomBuildInput = z.infer<typeof customBuildSchema>;
export type CheckoutItemInput = z.infer<typeof checkoutItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ReviewReplyInput = z.infer<typeof reviewReplySchema>;
export type SupportTicketInput = z.infer<typeof supportTicketSchema>;
export const ticketMessageSchema = z.object({
  message: z.string().min(1),
});
export type TicketMessageInput = z.infer<typeof ticketMessageSchema>;
