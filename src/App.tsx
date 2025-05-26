
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ClientDashboard from "./pages/ClientDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProductsManagement from "./pages/seller/ProductsManagement";
import RegisterPage from "./pages/RegisterPage";
import ClientOrdersPage from "./pages/client/ClientOrdersPage";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";
import CartPage from "./pages/CartPage";
import OrdersRedirectPage from "./pages/OrdersRedirectPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Redirect root to products page */}
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Orders route to redirect based on role */}
            <Route
              path="/orders"
              element={<OrdersRedirectPage />}
            />
            
            {/* Protected Routes */}
            <Route
              path="/client-dashboard"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client-dashboard/orders"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller-dashboard"
              element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller-dashboard/products"
              element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <ProductsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller-dashboard/orders"
              element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <SellerOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
