
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Cart, CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType>({
  cart: { items: [], total: 0 },
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const { user } = useAuth();
  const { products } = useProducts();

  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    const loadCart = () => {
      if (user) {
        const savedCart = localStorage.getItem(`cart_${user.id}`);
        if (savedCart) {
          try {
            // We need to rehydrate the products in the cart items
            const parsedCart: Cart = JSON.parse(savedCart);
            const rehydratedItems: CartItem[] = parsedCart.items
              .map(item => {
                const product = products.find(p => p.id === item.product.id);
                return product ? { ...item, product } : null;
              })
              .filter(Boolean) as CartItem[];

            setCart({
              items: rehydratedItems,
              total: calculateTotal(rehydratedItems)
            });
          } catch (e) {
            console.error('Error parsing cart:', e);
            setCart({ items: [], total: 0 });
          }
        } else {
          setCart({ items: [], total: 0 });
        }
      } else {
        // Clear cart when user logs out
        setCart({ items: [], total: 0 });
      }
    };

    // Only load cart once products are available
    if (products.length > 0) {
      loadCart();
    }
  }, [user, products]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user && cart.items.length > 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // Calculate the total price of all items in the cart
  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  // Add a product to the cart
  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.items.findIndex(item => item.product.id === product.id);
      
      let updatedItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new item to cart
        updatedItems = [
          ...prevCart.items,
          { product, quantity }
        ];
      }
      
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    });
  };

  // Remove a product from the cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.product.id !== productId);
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    });
  };

  // Update the quantity of a product in the cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      );
      
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    });
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart({ items: [], total: 0 });
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  // Count total items in cart
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
