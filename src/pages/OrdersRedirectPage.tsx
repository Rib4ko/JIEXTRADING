
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const OrdersRedirectPage = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      toast({
        title: "Authentification requise",
        description: "Vous devez vous connecter pour voir vos commandes",
        variant: "destructive",
      });
      navigate('/login', { replace: true });
      return;
    }

    // Redirect based on role
    if (user?.role === 'client') {
      navigate('/client-dashboard/orders', { replace: true });
    } else if (user?.role === 'seller') {
      navigate('/seller-dashboard/orders', { replace: true });
    } else if (user?.role === 'admin') {
      // For admin, redirect to an appropriate page
      navigate('/admin-dashboard', { replace: true });
    }
  }, [user, loading, isAuthenticated, navigate]);

  // Only show loading spinner while authentication check is in progress
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default OrdersRedirectPage;
