
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { AdminDashboardData, OrderAnalytics, ProductAnalytics, SellerAnalytics, FinancialAnalytics, ClientAnalytics } from '../types';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './AuthContext';

interface AdminContextType {
  dashboardData: AdminDashboardData | null;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({
  dashboardData: null,
  loading: false,
  refreshData: async () => {},
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAdminData = useCallback(async () => {
    if (!user || user.role !== 'admin') {
      setDashboardData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch all necessary data
      const [ordersData, productsData, sellersData, paymentsData, storageCostsData, userRolesData] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('products').select('*'),
        supabase.from('sellers').select('*'),
        supabase.from('payments').select('*'),
        supabase.from('storage_costs').select('*'),
        supabase.from('user_roles').select('*')
      ]);

      const orders = ordersData.data || [];
      const products = productsData.data || [];
      const sellers = sellersData.data || [];
      const payments = paymentsData.data || [];
      const storageCosts = storageCostsData.data || [];
      const userRoles = userRolesData.data || [];

      // Calculate analytics
      const orderAnalytics = calculateOrderAnalytics(orders, products, payments);
      const productAnalytics = calculateProductAnalytics(products, orders, payments);
      const sellerAnalytics = calculateSellerAnalytics(sellers, orders);
      const financialAnalytics = calculateFinancialAnalytics(payments, storageCosts);
      const clientAnalytics = calculateClientAnalytics(orders, userRoles, payments);

      setDashboardData({
        orders: orderAnalytics,
        products: productAnalytics,
        sellers: sellerAnalytics,
        financial: financialAnalytics,
        clients: clientAnalytics,
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const refreshData = async () => {
    await fetchAdminData();
  };

  return (
    <AdminContext.Provider value={{ dashboardData, loading, refreshData }}>
      {children}
    </AdminContext.Provider>
  );
};

// Helper functions for calculations
const calculateOrderAnalytics = (orders: any[], products: any[], payments: any[]): OrderAnalytics => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisYear = new Date(now.getFullYear(), 0, 1);

  const dailyOrders = orders.filter(o => new Date(o.created_at) >= today).length;
  const monthlyOrders = orders.filter(o => new Date(o.created_at) >= thisMonth).length;
  const yearlyOrders = orders.filter(o => new Date(o.created_at) >= thisYear).length;

  const statusBreakdown = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalOrderValue = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

  const ordersPerProduct = products.map(product => {
    const productOrders = orders.filter(o => o.product_id === product.id);
    const productPayments = payments.filter(p => 
      orders.find(o => o.id === p.order_id && o.product_id === product.id)
    );
    return {
      productId: product.id,
      productTitle: product.title,
      orderCount: productOrders.length,
      totalValue: productPayments.reduce((sum, p) => sum + Number(p.amount), 0)
    };
  });

  const clientOrdersMap = orders.reduce((acc, order) => {
    if (!acc[order.client_id]) {
      acc[order.client_id] = { orderCount: 0, totalValue: 0 };
    }
    acc[order.client_id].orderCount += 1;
    const payment = payments.find(p => p.order_id === order.id);
    if (payment) {
      acc[order.client_id].totalValue += Number(payment.amount);
    }
    return acc;
  }, {} as Record<string, { orderCount: number; totalValue: number }>);

  const ordersPerClient = Object.entries(clientOrdersMap).map(([clientId, data]: [string, { orderCount: number; totalValue: number }]) => ({
    clientId,
    clientName: `Client ${clientId.slice(0, 8)}`,
    orderCount: data.orderCount,
    totalValue: data.totalValue
  }));

  return {
    totalOrders: orders.length,
    dailyOrders,
    monthlyOrders,
    yearlyOrders,
    statusBreakdown: statusBreakdown as Record<any, number>,
    totalOrderValue,
    ordersPerProduct,
    ordersPerClient
  };
};

const calculateProductAnalytics = (products: any[], orders: any[], payments: any[]): ProductAnalytics => {
  const bestSellingProducts = products.map(product => {
    const productOrders = orders.filter(o => o.product_id === product.id);
    const totalSold = productOrders.reduce((sum, o) => sum + o.quantity, 0);
    const revenue = payments
      .filter(p => orders.find(o => o.id === p.order_id && o.product_id === product.id))
      .reduce((sum, p) => sum + Number(p.amount), 0);
    
    return {
      productId: product.id,
      title: product.title,
      totalSold,
      revenue
    };
  }).sort((a, b) => b.totalSold - a.totalSold);

  const totalValueSold = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const averageOrderValue = payments.length > 0 ? totalValueSold / payments.length : 0;

  return {
    totalProducts: products.length,
    bestSellingProducts,
    totalValueSold,
    averageOrderValue
  };
};

const calculateSellerAnalytics = (sellers: any[], orders: any[]): SellerAnalytics => {
  const ordersPerSeller = sellers.map(seller => {
    const sellerOrders = orders.filter(o => o.seller_id === seller.id);
    const confirmedOrders = sellerOrders.filter(o => o.status === 'confirmed' || o.status === 'completed');
    const validationRate = sellerOrders.length > 0 ? (confirmedOrders.length / sellerOrders.length) * 100 : 0;
    
    return {
      sellerId: seller.id,
      sellerName: seller.name,
      orderCount: sellerOrders.length,
      validationRate
    };
  });

  const topPerformingSellers = ordersPerSeller
    .sort((a, b) => b.orderCount - a.orderCount)
    .map(seller => ({
      sellerId: seller.sellerId,
      sellerName: seller.sellerName,
      revenue: 0, // Would need to calculate from payments
      orderCount: seller.orderCount
    }));

  return {
    totalSellers: sellers.length,
    ordersPerSeller,
    topPerformingSellers
  };
};

const calculateFinancialAnalytics = (payments: any[], storageCosts: any[]): FinancialAnalytics => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisYear = new Date(now.getFullYear(), 0, 1);

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalCosts = payments.reduce((sum, p) => sum + Number(p.cost), 0);
  const totalStorageCosts = storageCosts.reduce((sum, sc) => sum + Number(sc.cost_amount), 0);

  const dailyRevenue = payments
    .filter(p => new Date(p.payment_date) >= today)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const monthlyRevenue = payments
    .filter(p => new Date(p.payment_date) >= thisMonth)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const yearlyRevenue = payments
    .filter(p => new Date(p.payment_date) >= thisYear)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0;
  const netProfit = totalRevenue - totalCosts - totalStorageCosts;

  return {
    totalRevenue,
    dailyRevenue,
    monthlyRevenue,
    yearlyRevenue,
    totalCosts,
    profitMargin,
    storageCosts: totalStorageCosts,
    netProfit
  };
};

const calculateClientAnalytics = (orders: any[], userRoles: any[], payments: any[]): ClientAnalytics => {
  const clients = userRoles.filter(ur => ur.role === 'client');
  
  const clientStats = clients.map(client => {
    const clientOrders = orders.filter(o => o.client_id === client.user_id);
    const clientPayments = payments.filter(p => 
      orders.find(o => o.id === p.order_id && o.client_id === client.user_id)
    );
    const totalSpent = clientPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const lastOrder = clientOrders.length > 0 
      ? clientOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
      : '';

    return {
      clientId: client.user_id,
      clientName: `Client ${client.user_id.slice(0, 8)}`,
      orderCount: clientOrders.length,
      totalSpent,
      lastOrder
    };
  });

  const mostActiveClient = clientStats.reduce((most, current) => 
    current.orderCount > most.orderCount ? current : most,
    { clientId: '', clientName: '', orderCount: 0, totalSpent: 0 }
  );

  return {
    totalClients: clients.length,
    mostActiveClient,
    clientOrderHistory: clientStats.sort((a, b) => b.orderCount - a.orderCount)
  };
};
