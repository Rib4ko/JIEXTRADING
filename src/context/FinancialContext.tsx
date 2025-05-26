
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Payment, StorageCost } from '../types';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './AuthContext';
import { toast } from "@/hooks/use-toast";

interface FinancialContextType {
  payments: Payment[];
  storageCosts: StorageCost[];
  loading: boolean;
  addPayment: (payment: Omit<Payment, 'id' | 'margin' | 'created_at'>) => Promise<boolean>;
  addStorageCost: (storageCost: Omit<StorageCost, 'id' | 'created_at'>) => Promise<boolean>;
  updateStorageCost: (id: string, updates: Partial<StorageCost>) => Promise<boolean>;
  deleteStorageCost: (id: string) => Promise<boolean>;
  getMonthlyRevenue: (month: number, year: number) => number;
  getMonthlyStorageCosts: (month: number, year: number) => number;
  getTotalMargin: () => number;
}

const FinancialContext = createContext<FinancialContextType>({
  payments: [],
  storageCosts: [],
  loading: false,
  addPayment: async () => false,
  addStorageCost: async () => false,
  updateStorageCost: async () => false,
  deleteStorageCost: async () => false,
  getMonthlyRevenue: () => 0,
  getMonthlyStorageCosts: () => 0,
  getTotalMargin: () => 0,
});

export const useFinancial = () => useContext(FinancialContext);

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [storageCosts, setStorageCosts] = useState<StorageCost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPayments = useCallback(async () => {
    if (!user || user.role !== 'seller') return;
    
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('payment_date', { ascending: false });

      if (error) throw error;
      
      const normalizedPayments: Payment[] = (data || []).map((row: any) => ({
        id: row.id,
        order_id: row.order_id,
        amount: Number(row.amount),
        cost: Number(row.cost),
        margin: Number(row.margin),
        payment_date: row.payment_date,
        created_at: row.created_at,
      }));

      setPayments(normalizedPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    }
  }, [user]);

  const fetchStorageCosts = useCallback(async () => {
    if (!user || user.role !== 'seller') return;
    
    try {
      const { data, error } = await supabase
        .from('storage_costs')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      
      const normalizedStorageCosts: StorageCost[] = (data || []).map((row: any) => ({
        id: row.id,
        product_id: row.product_id,
        cost_amount: Number(row.cost_amount),
        month: row.month,
        year: row.year,
        created_at: row.created_at,
      }));

      setStorageCosts(normalizedStorageCosts);
    } catch (error) {
      console.error('Error fetching storage costs:', error);
      setStorageCosts([]);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPayments(), fetchStorageCosts()]);
      setLoading(false);
    };

    if (user) {
      fetchData();
    } else {
      setPayments([]);
      setStorageCosts([]);
      setLoading(false);
    }
  }, [user, fetchPayments, fetchStorageCosts]);

  const addPayment = async (paymentData: Omit<Payment, 'id' | 'margin' | 'created_at'>): Promise<boolean> => {
    if (!user || user.role !== 'seller') return false;

    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          order_id: paymentData.order_id,
          amount: paymentData.amount,
          cost: paymentData.cost,
          payment_date: paymentData.payment_date,
        }])
        .select()
        .single();

      if (error) throw error;

      const newPayment: Payment = {
        id: data.id,
        order_id: data.order_id,
        amount: Number(data.amount),
        cost: Number(data.cost),
        margin: Number(data.margin),
        payment_date: data.payment_date,
        created_at: data.created_at,
      };

      setPayments(prev => [newPayment, ...prev]);
      
      toast({
        title: "Payment Added",
        description: "Payment record has been successfully added.",
      });

      return true;
    } catch (error) {
      console.error('Error adding payment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add payment record.",
      });
      return false;
    }
  };

  const addStorageCost = async (storageCostData: Omit<StorageCost, 'id' | 'created_at'>): Promise<boolean> => {
    if (!user || user.role !== 'seller') return false;

    try {
      const { data, error } = await supabase
        .from('storage_costs')
        .insert([storageCostData])
        .select()
        .single();

      if (error) throw error;

      const newStorageCost: StorageCost = {
        id: data.id,
        product_id: data.product_id,
        cost_amount: Number(data.cost_amount),
        month: data.month,
        year: data.year,
        created_at: data.created_at,
      };

      setStorageCosts(prev => [newStorageCost, ...prev]);
      
      toast({
        title: "Storage Cost Added",
        description: "Storage cost record has been successfully added.",
      });

      return true;
    } catch (error) {
      console.error('Error adding storage cost:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add storage cost record.",
      });
      return false;
    }
  };

  const updateStorageCost = async (id: string, updates: Partial<StorageCost>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('storage_costs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setStorageCosts(prev => prev.map(sc => 
        sc.id === id ? {
          ...sc,
          cost_amount: Number(data.cost_amount),
          month: data.month,
          year: data.year,
        } : sc
      ));

      return true;
    } catch (error) {
      console.error('Error updating storage cost:', error);
      return false;
    }
  };

  const deleteStorageCost = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('storage_costs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStorageCosts(prev => prev.filter(sc => sc.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting storage cost:', error);
      return false;
    }
  };

  const getMonthlyRevenue = (month: number, year: number): number => {
    return payments
      .filter(payment => {
        const paymentDate = new Date(payment.payment_date);
        return paymentDate.getMonth() + 1 === month && paymentDate.getFullYear() === year;
      })
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const getMonthlyStorageCosts = (month: number, year: number): number => {
    return storageCosts
      .filter(cost => cost.month === month && cost.year === year)
      .reduce((total, cost) => total + cost.cost_amount, 0);
  };

  const getTotalMargin = (): number => {
    return payments.reduce((total, payment) => total + payment.margin, 0);
  };

  return (
    <FinancialContext.Provider
      value={{
        payments,
        storageCosts,
        loading,
        addPayment,
        addStorageCost,
        updateStorageCost,
        deleteStorageCost,
        getMonthlyRevenue,
        getMonthlyStorageCosts,
        getTotalMargin,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};
