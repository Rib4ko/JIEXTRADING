
import React from 'react';
import { AuthProvider } from './AuthContext';
import { ProductProvider } from './ProductContext';
import { CartProvider } from './CartContext';
import { OrderProvider } from './OrderContext';
import { FinancialProvider } from './FinancialContext';
import { AdminProvider } from './AdminContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <FinancialProvider>
              <AdminProvider>
                {children}
              </AdminProvider>
            </FinancialProvider>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};
