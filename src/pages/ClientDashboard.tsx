
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/layouts/MainLayout';
import { Link, Navigate } from 'react-router-dom';

const ClientDashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'client') {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Tableau de Bord Client
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/client-dashboard/orders" className="block">
            <Card className="hover:shadow-xl transition-all duration-200 border-blue-200 hover:border-blue-300 group">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-150">
                <CardTitle className="text-blue-800">Mes Commandes</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Voir et suivre vos commandes</p>
              </CardContent>
            </Card>
          </Link>
          <Card className="hover:shadow-xl transition-all duration-200 border-blue-200 hover:border-blue-300 group">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-150">
              <CardTitle className="text-blue-800">Panier</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Consulter les articles de votre panier</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-all duration-200 border-blue-200 hover:border-blue-300 group">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-150">
              <CardTitle className="text-blue-800">Paramètres du Profil</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Mettre à jour les détails de votre compte</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientDashboard;
