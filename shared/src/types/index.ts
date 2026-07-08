export type UserRole = 'ADMIN' | 'EDITOR' | 'CUSTOMER_SUPPORT' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;      // e.g., "Carbon Fiber Frame Only"
  price: number;
  stock: number;
  attributes: Record<string, string>; // e.g. { color: "matte-black", material: "carbon-fiber", size: "220mm" }
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  category: 'LAMP' | 'DRONE';
  images: string[];
  specs: Record<string, string>;
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  isCustomizable: boolean;
  cadFileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomBuild {
  id: string;
  userId?: string;
  category: 'LAMP' | 'DRONE';
  configuration: {
    material: string;
    color: string;
    size: string;
    finish: string;
    lighting?: string;
    logoUrl?: string;
    dimensions: { length: number; width: number; height: number };
  };
  price: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  customBuildId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  specs: string; // Brief description
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  customBuildId?: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'MANUFACTURING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentIntentId?: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  videoUrl?: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  replies: ReviewReply[];
  isSoftDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewReply {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  comment: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  email: string;
  subject: string;
  category: 'ORDER' | 'CUSTOM_BUILD' | 'TECHNICAL' | 'GENERAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  messages: {
    id: string;
    senderId?: string;
    senderName: string;
    senderRole: UserRole | 'VISITOR';
    message: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
  createdAt: string;
}
