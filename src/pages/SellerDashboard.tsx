
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/layouts/MainLayout';
import { Navigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { useFinancial } from '../context/FinancialContext';
import { Package, ShoppingCart, TrendingUp, DollarSign, Wallet, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SellerDashboard = () => {
  const { user } = useAuth();
  const { sellerProducts } = useProducts();
  const { sellerOrders } = useOrders();
  const { payments, getTotalMargin, getMonthlyRevenue, getMonthlyStorageCosts } = useFinancial();

  if (!user || user.role !== 'seller') {
    return <Navigate to="/login" replace />;
  }

  // Calculate current month metrics
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const monthlyRevenue = getMonthlyRevenue(currentMonth, currentYear);
  const monthlyStorageCosts = getMonthlyStorageCosts(currentMonth, currentYear);
  const totalMargin = getTotalMargin();
  const netProfit = monthlyRevenue - monthlyStorageCosts;

  const pendingOrders = sellerOrders.filter(order => order.status === 'pending').length;
  const totalPayments = payments.length;

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Tableau de Bord Vendeur
        </h1>
        
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="transition-all duration-200 hover:shadow-xl border-blue-200 hover:border-blue-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Total Produits
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-blue-600">{sellerProducts.length}</p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-xl border-blue-200 hover:border-blue-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Commandes en Attente
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-blue-600">{pendingOrders}</p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-xl border-blue-200 hover:border-blue-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="text-green-800 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Revenus ce Mois
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-green-600">{monthlyRevenue.toFixed(2)} MAD</p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-xl border-orange-200 hover:border-orange-300">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Coûts de Stockage
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-orange-600">{monthlyStorageCosts.toFixed(2)} MAD</p>
              <p className="text-sm text-muted-foreground mt-1">Ce mois-ci</p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-xl border-purple-200 hover:border-purple-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Marge Totale
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold text-purple-600">{totalMargin.toFixed(2)} MAD</p>
              <p className="text-sm text-muted-foreground mt-1">{totalPayments} paiements</p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-xl border-emerald-200 hover:border-emerald-300">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Profit Net ce Mois
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {netProfit.toFixed(2)} MAD
              </p>
              <p className="text-sm text-muted-foreground mt-1">Revenus - Coûts</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/seller-dashboard/products" className="no-underline">
            <Card className="transition-all duration-200 hover:shadow-xl border-blue-200 hover:border-blue-300 group h-full">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-150">
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Mes Produits
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">Gérer vos listes de produits</p>
                <p className="text-sm text-blue-600 font-medium">
                  {sellerProducts.length} produit{sellerProducts.length !== 1 ? 's' : ''} enregistré{sellerProducts.length !== 1 ? 's' : ''}
                </p>
                <Button variant="outline" className="mt-3 w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                  Voir les Produits
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/seller-dashboard/orders" className="no-underline">
            <Card className="transition-all duration-200 hover:shadow-xl border-blue-200 hover:border-blue-300 group h-full">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-150">
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Commandes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">Voir et traiter les commandes</p>
                <p className="text-sm text-blue-600 font-medium">
                  {sellerOrders.length} commande{sellerOrders.length !== 1 ? 's' : ''} au total
                </p>
                <Button variant="outline" className="mt-3 w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                  Gérer les Commandes
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="transition-all duration-200 hover:shadow-xl border-green-200 hover:border-green-300 group h-full">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 group-hover:from-green-100 group-hover:to-green-150">
              <CardTitle className="text-green-800 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analyses Financières
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">Suivre vos performances financières</p>
              <p className="text-sm text-green-600 font-medium">
                Marge: {totalMargin.toFixed(2)} MAD
              </p>
              <Button variant="outline" className="mt-3 w-full border-green-200 text-green-600 hover:bg-green-50">
                Voir les Analyses
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SellerDashboard;
