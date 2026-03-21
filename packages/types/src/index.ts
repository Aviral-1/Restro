// ============================================
// @restro/types — Shared TypeScript Interfaces
// ============================================

// ---------- User & Auth ----------
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'restaurant_owner' | 'delivery_partner' | 'customer';
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  role: IUser['role'];
  phone?: string;
}

export interface IAuthResponse {
  accessToken: string;
  user: Omit<IUser, 'password'>;
}

// ---------- Restaurant ----------
export interface IRestaurant {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  description?: string;
  address: IAddress;
  contact: IContact;
  cuisineType: string[];
  operatingHours: IOperatingHours[];
  isActive: boolean;
  ownerId: string;
  rating: number;
  totalOrders: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface IContact {
  phone: string;
  email?: string;
  website?: string;
}

export interface IOperatingHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

// ---------- Table & QR ----------
export interface ITable {
  _id: string;
  restaurantId: string;
  tableNumber: number;
  capacity: number;
  qrCode: string;
  isActive: boolean;
}

// ---------- Menu ----------
export interface IMenuCategory {
  _id: string;
  restaurantId: string;
  name: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface IMenuItem {
  _id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  image?: string;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  tags: string[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// ---------- Cart ----------
export interface ICartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  isVeg: boolean;
}

export interface ICart {
  restaurantId: string;
  tableNumber?: number;
  items: ICartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

// ---------- Order ----------
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface IOrder {
  _id: string;
  orderNumber: string;
  restaurantId: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: IAddress;
  tableNumber?: number;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  deliveryPartnerId?: string;
  estimatedDeliveryTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
}

// ---------- Payment ----------
export interface IPayment {
  _id: string;
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: 'created' | 'captured' | 'failed' | 'refunded';
  method?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePaymentOrder {
  orderId: string;
  amount: number;
}

export interface IVerifyPayment {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

// ---------- Delivery ----------
export interface IDeliveryPartner {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  vehicleType: 'bike' | 'scooter' | 'car';
  vehicleNumber: string;
  isAvailable: boolean;
  currentLocation?: { lat: number; lng: number };
  totalDeliveries: number;
  rating: number;
  createdAt: Date;
}

// ---------- Tracking ----------
export interface ITrackingLog {
  _id: string;
  orderId: string;
  status: OrderStatus;
  message: string;
  location?: { lat: number; lng: number };
  timestamp: Date;
}

// ---------- Notification ----------
export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'delivery' | 'payment' | 'system';
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: Date;
}

// ---------- Analytics ----------
export interface IAnalyticsDashboard {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItems: { name: string; count: number; revenue: number }[];
  peakHours: { hour: number; orders: number }[];
  revenueTrend: { date: string; revenue: number }[];
  repeatCustomers: number;
  newCustomers: number;
  ordersByStatus: Record<OrderStatus, number>;
}

// ---------- API Response ----------
export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ---------- Socket Events ----------
export enum SocketEvents {
  NEW_ORDER = 'new_order',
  ORDER_STATUS_UPDATE = 'order_status_update',
  DELIVERY_LOCATION_UPDATE = 'delivery_location_update',
  NEW_DELIVERY_ASSIGNMENT = 'new_delivery_assignment',
  NOTIFICATION = 'notification',
  JOIN_RESTAURANT = 'join_restaurant',
  JOIN_ORDER = 'join_order',
  JOIN_DELIVERY = 'join_delivery',
}

// ---------- SaaS & Subscriptions ----------
export type SubscriptionPlanType = 'basic' | 'pro' | 'enterprise';

export interface ISubscriptionPlan {
  _id: string;
  type: SubscriptionPlanType;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    maxItems: number;
    maxOrders: number;
    maxTables: number;
    hasAnalytics: boolean;
    hasCustomBranding: boolean;
  };
}

export interface ISubscription {
  _id: string;
  restaurantId: string;
  planId: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  paymentMethodId?: string;
}

// ---------- Coupons & Promotions ----------
export interface ICoupon {
  _id: string;
  restaurantId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate?: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: Date;
}

// ---------- Platform (Super Admin) ----------
export interface IPlatformAnalytics {
  totalRevenue: number;
  totalRestaurants: number;
  activeSubscriptions: number;
  totalOrders: number;
  revenueByPlan: Record<SubscriptionPlanType, number>;
  topPerformingRestaurants: { name: string; revenue: number; orders: number }[];
  growthTrend: { date: string; newRestaurants: number; revenue: number }[];
}

export interface IRestaurantApproval {
  restaurantId: string;
  status: 'approved' | 'rejected' | 'suspended';
  reason?: string;
}
