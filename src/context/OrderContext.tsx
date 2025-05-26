
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../types';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useProducts } from './ProductContext';
import { toast } from "@/hooks/use-toast";

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  sellerOrders: Order[];
  loading: boolean;
  placeOrder: (quantity: number, address: string, productId?: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  userOrders: [],
  sellerOrders: [],
  loading: false,
  placeOrder: async () => null,
  updateOrderStatus: async () => false,
  getOrderById: () => undefined,
});

export const useOrders = () => useContext(OrderContext);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { products, fetchSellerById } = useProducts();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      setOrders(data as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchOrders();
    else setOrders([]);
  }, [user, fetchOrders]);

  // Filter orders for current client/seller
  const userOrders = user?.role === 'client'
    ? orders.filter(order => order.client_id === user.id)
    : [];
  const sellerOrders = user?.role === 'seller'
    ? orders.filter(order => order.seller_id === user.id)
    : [];

  // Place a new order
  const placeOrder = async (quantity: number, address: string, productId?: string): Promise<Order | null> => {
    if (!user) return null;
    let selectedProductId = productId;
    if (!selectedProductId && cart.items.length === 0) return null;
    if (!selectedProductId) selectedProductId = cart.items[0].product.id;
    
    const selectedProduct = productId 
      ? products.find(p => p.id === productId)
      : cart.items.find(item => item.product.id === selectedProductId)?.product;
    
    if (!selectedProduct) return null;
    const selectedSellerId = selectedProduct.sellerId;
    
    try {
      // Check if seller exists - if not, we'll proceed anyway as the seller info isn't critical
      // for placing an order in this demo application
      const seller = await fetchSellerById(selectedSellerId);
      
      // If seller doesn't exist, we'll just log it but continue with the order
      if (!seller) {
        console.log(`Note: Seller ${selectedSellerId} does not exist in sellers table`);
      }
      
      setLoading(true);
      
      // Insert row into orders
      const insertData = {
        client_id: user.id,
        product_id: selectedProductId,
        seller_id: selectedSellerId,
        quantity,
        status: "pending" as OrderStatus,
      };
      
      const { data, error } = await supabase
        .from('orders')
        .insert([insertData])
        .select()
        .single();
        
      if (error || !data) {
        console.error('Error inserting order:', error);
        toast({
          variant: "destructive",
          title: "Order Failed",
          description: "Could not place your order at this time. Please try again later."
        });
        throw error;
      }

      const newOrder: Order = {
        id: data.id,
        client_id: data.client_id,
        product_id: data.product_id,
        seller_id: data.seller_id,
        quantity: data.quantity,
        status: data.status,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      
      setOrders(prev => [newOrder, ...prev]);
      
      if (!productId) {
        clearCart();
      }
      
      toast({
        title: "Order Placed Successfully",
        description: `Your order has been placed and is being processed.`,
      });
      
      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      const { data, error } = await supabase.from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error || !data) return false;

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: data.status, updated_at: data.updated_at } : o
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating order:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get a specific order by ID
  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        userOrders,
        sellerOrders,
        loading,
        placeOrder,
        updateOrderStatus,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
