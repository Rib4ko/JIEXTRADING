
// Type definitions for the application

export type UserRole = 'client' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string; // In a real app, this would never be stored as plain text
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  keywords: string[];
  imageUrl: string;
  sellerId: string;
  createdAt: string;
}

// Order status matches Supabase ENUM
export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  client_id: string;
  product_id: string;
  seller_id: string;
  quantity: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  cost: number;
  margin: number;
  payment_date: string;
  created_at: string;
}

export interface StorageCost {
  id: string;
  product_id: string;
  cost_amount: number;
  month: number;
  year: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface AnalyticsData {
  totalSales: number;
  totalProducts: number;
  totalSellers: number;
  totalOrders: number;
  totalRevenue: number;
  totalCosts: number;
  totalMargin: number;
  monthlyStorageCosts: number;
}

export interface Seller {
  id: string; // Same as user's UUID
  name: string;
  contact_email: string;
  created_at: string;
}

// Admin Analytics Types
export interface OrderAnalytics {
  totalOrders: number;
  dailyOrders: number;
  monthlyOrders: number;
  yearlyOrders: number;
  statusBreakdown: Record<OrderStatus, number>;
  totalOrderValue: number;
  ordersPerProduct: Array<{ productId: string; productTitle: string; orderCount: number; totalValue: number }>;
  ordersPerClient: Array<{ clientId: string; clientName: string; orderCount: number; totalValue: number }>;
}

export interface ProductAnalytics {
  totalProducts: number;
  bestSellingProducts: Array<{ productId: string; title: string; totalSold: number; revenue: number }>;
  totalValueSold: number;
  averageOrderValue: number;
}

export interface SellerAnalytics {
  totalSellers: number;
  ordersPerSeller: Array<{ sellerId: string; sellerName: string; orderCount: number; validationRate: number }>;
  topPerformingSellers: Array<{ sellerId: string; sellerName: string; revenue: number; orderCount: number }>;
}

export interface FinancialAnalytics {
  totalRevenue: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalCosts: number;
  profitMargin: number;
  storageCosts: number;
  netProfit: number;
}

export interface ClientAnalytics {
  totalClients: number;
  mostActiveClient: { clientId: string; clientName: string; orderCount: number; totalSpent: number };
  clientOrderHistory: Array<{ clientId: string; clientName: string; orderCount: number; totalSpent: number; lastOrder: string }>;
}

export interface AdminDashboardData {
  orders: OrderAnalytics;
  products: ProductAnalytics;
  sellers: SellerAnalytics;
  financial: FinancialAnalytics;
  clients: ClientAnalytics;
}
