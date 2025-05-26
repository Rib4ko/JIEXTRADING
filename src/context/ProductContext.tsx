import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { Seller } from '../types';

interface ProductContextType {
  products: Product[];
  sellerProducts: Product[];
  loading: boolean;
  getProduct: (id: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  addProduct: (product: Omit<Product, 'id' | 'sellerId' | 'createdAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  fetchSellerById: (id: string) => Promise<Seller | null>;
  upsertSeller: (seller: Omit<Seller, 'created_at'>) => Promise<boolean>;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  sellerProducts: [],
  loading: false,
  getProduct: () => undefined,
  searchProducts: () => [],
  addProduct: async () => { throw new Error('Not implemented'); },
  updateProduct: async () => false,
  deleteProduct: async () => false,
  fetchSellerById: async () => null,
  upsertSeller: async () => false,
});

export const useProducts = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSellerById = async (id: string): Promise<Seller | null> => {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error || !data) return null;
      return {
        id: data.id,
        name: data.name,
        contact_email: data.contact_email,
        created_at: data.created_at,
      };
    } catch (error) {
      console.error('Error fetching seller:', error);
      return null;
    }
  };

  const upsertSeller = async (seller: Omit<Seller, 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('sellers')
        .upsert([
          {
            id: seller.id,
            name: seller.name,
            contact_email: seller.contact_email,
          }
        ]);
      return !error;
    } catch (error) {
      console.error('Error upserting seller:', error);
      return false;
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const normalized: Product[] = (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        price: Number(row.price || 0),
        keywords: row.keywords || [],
        imageUrl: row.image_url || '',
        sellerId: row.seller_id,
        createdAt: row.created_at,
      }));
      
      setProducts(normalized);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const sellerProducts = user?.role === 'seller' ? products.filter(p => p.sellerId === user.id) : [];

  const getProduct = (id: string) => {
    return products.find(p => p.id === id);
  };

  const searchProducts = (query: string) => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.keywords.some(k => k.toLowerCase().includes(q))
    );
  };

  const addProduct = async (productInput: Omit<Product, 'id' | 'sellerId' | 'createdAt'>) => {
    if (!user || user.role !== 'seller') throw new Error('Only sellers can add products');
    setLoading(true);
    try {
      const insertPayload = {
        title: productInput.title,
        description: productInput.description,
        keywords: productInput.keywords,
        price: productInput.price,
        image_url: productInput.imageUrl,
        seller_id: user.id,
      };
      const { data, error } = await supabase
        .from('products')
        .insert([insertPayload])
        .select()
        .single();
      if (error || !data) throw new Error(error?.message || 'Failed to add product');

      const newProduct: Product = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        price: Number(data.price),
        keywords: data.keywords || [],
        imageUrl: data.image_url || '',
        sellerId: data.seller_id,
        createdAt: data.created_at,
      };
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setLoading(true);
    try {
      const payload: any = {};
      if (updates.title) payload.title = updates.title;
      if (updates.description) payload.description = updates.description;
      if (updates.keywords) payload.keywords = updates.keywords;
      if (typeof updates.price === 'number') payload.price = updates.price;
      if (updates.imageUrl) payload.image_url = updates.imageUrl;

      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .eq('seller_id', user?.id)
        .select()
        .single();

      if (error || !data) return false;

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? {
          ...p,
          title: data.title,
          description: data.description || '',
          price: Number(data.price),
          keywords: data.keywords || [],
          imageUrl: data.image_url || '',
          sellerId: data.seller_id,
          createdAt: data.created_at,
        } : p))
      );
      return true;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('seller_id', user?.id);
      if (error) return false;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return true;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        sellerProducts,
        loading,
        getProduct,
        searchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        fetchSellerById,
        upsertSeller,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
