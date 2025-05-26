
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Navigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  BarChart3,
  PieChart,
  RefreshCw,
  Shield
} from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const { user, refreshUserRole } = useAuth();
  const { dashboardData, loading, refreshData } = useAdmin();

  // Enhanced logging for debugging
  console.log('=== AdminDashboard Debug Info ===');
  console.log('Current user object:', user);
  console.log('User ID:', user?.id);
  console.log('User email:', user?.email);
  console.log('User role:', user?.role);
  console.log('Is admin check (user?.role === "admin"):', user?.role === 'admin');
  console.log('String comparison check:', typeof user?.role, user?.role, user?.role === 'admin');

  if (!user) {
    console.log('AdminDashboard - No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    console.log('AdminDashboard - User is not admin. Role:', user.role, 'Type:', typeof user.role);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600 flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Accès Refusé
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Vous n'avez pas les permissions d'administrateur.</p>
            <div className="bg-gray-100 p-3 rounded-md text-sm text-left">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID utilisateur:</strong> {user.id}</p>
              <p><strong>Rôle actuel:</strong> {user.role}</p>
              <p><strong>Type de rôle:</strong> {typeof user.role}</p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={refreshUserRole} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser le rôle
              </Button>
              <Button onClick={() => window.location.href = '/products'} variant="default">
                Retour aux produits
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Si vous devriez avoir accès, contactez l'administrateur système avec votre ID utilisateur.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRefreshRole = async () => {
    await refreshUserRole();
    console.log('Role refreshed for user:', user.email);
  };

  if (loading) {
    return (
      <DashboardLayout title="Tableau de Bord Administrateur">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardLayout title="Tableau de Bord Administrateur">
        <div className="text-center text-muted-foreground">
          <p>Aucune donnée disponible</p>
          <Button onClick={handleRefreshRole} className="mt-4" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser le rôle
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const { orders, products, sellers, financial, clients } = dashboardData;

  return (
    <DashboardLayout title="Tableau de Bord Administrateur">
      <div className="space-y-6">
        {/* Admin Header with Debug Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Accès Administrateur Confirmé</h3>
          </div>
          <div className="text-sm text-green-700">
            <p>Connecté en tant qu'administrateur: <strong>{user.email}</strong></p>
            <p>ID utilisateur: <strong>{user.id}</strong></p>
            <p>Rôle: <strong>{user.role}</strong></p>
          </div>
          <div className="flex gap-2 mt-3">
            <Button onClick={handleRefreshRole} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser le rôle
            </Button>
            <Button onClick={refreshData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser les données
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {orders.dailyOrders} aujourd'hui, {orders.monthlyOrders} ce mois
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financial.totalRevenue.toFixed(2)} MAD</div>
              <p className="text-xs text-muted-foreground">
                {financial.monthlyRevenue.toFixed(2)} MAD ce mois
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marge Bénéficiaire</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financial.profitMargin.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Profit net: {financial.netProfit.toFixed(2)} MAD
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                Client le plus actif: {clients.mostActiveClient.orderCount} commandes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Analytics */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                Analyse des Commandes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                  <p className="text-2xl font-semibold text-blue-600">{orders.dailyOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ce mois</p>
                  <p className="text-2xl font-semibold text-green-600">{orders.monthlyOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cette année</p>
                  <p className="text-2xl font-semibold text-purple-600">{orders.yearlyOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valeur totale</p>
                  <p className="text-2xl font-semibold text-orange-600">{orders.totalOrderValue.toFixed(0)} MAD</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Statut des commandes</h4>
                {Object.entries(orders.statusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="capitalize text-sm">{status}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Statistiques Produits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Produits totaux</p>
                  <p className="text-2xl font-semibold text-green-600">{products.totalProducts}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valeur vendue</p>
                  <p className="text-2xl font-semibold text-blue-600">{products.totalValueSold.toFixed(0)} MAD</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Top 3 Produits</h4>
                <div className="space-y-2">
                  {products.bestSellingProducts.slice(0, 3).map((product, index) => (
                    <div key={product.productId} className="flex justify-between items-center text-sm">
                      <span className="truncate">{index + 1}. {product.title}</span>
                      <span className="font-medium">{product.totalSold} vendus</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Analytics */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              Analyses Financières
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <div>
                <p className="text-sm text-muted-foreground">Revenus journaliers</p>
                <p className="text-xl font-semibold text-green-600">{financial.dailyRevenue.toFixed(2)} MAD</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenus mensuels</p>
                <p className="text-xl font-semibold text-blue-600">{financial.monthlyRevenue.toFixed(2)} MAD</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenus annuels</p>
                <p className="text-xl font-semibold text-purple-600">{financial.yearlyRevenue.toFixed(2)} MAD</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coûts totaux</p>
                <p className="text-xl font-semibold text-red-600">{financial.totalCosts.toFixed(2)} MAD</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coûts stockage</p>
                <p className="text-xl font-semibold text-orange-600">{financial.storageCosts.toFixed(2)} MAD</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profit net</p>
                <p className="text-xl font-semibold text-emerald-600">{financial.netProfit.toFixed(2)} MAD</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seller Performance */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              Performance des Vendeurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendeur</TableHead>
                  <TableHead>Commandes</TableHead>
                  <TableHead>Taux de validation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellers.ordersPerSeller.slice(0, 5).map((seller) => (
                  <TableRow key={seller.sellerId}>
                    <TableCell className="font-medium">{seller.sellerName}</TableCell>
                    <TableCell>{seller.orderCount}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${seller.validationRate >= 80 ? 'text-green-600' : seller.validationRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {seller.validationRate.toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Client Analytics */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-600" />
                Analyse des Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client le plus actif</p>
                  <p className="font-medium">{clients.mostActiveClient.clientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {clients.mostActiveClient.orderCount} commandes • {clients.mostActiveClient.totalSpent.toFixed(2)} MAD dépensés
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Top 5 Clients</h4>
                  <div className="space-y-2">
                    {clients.clientOrderHistory.slice(0, 5).map((client) => (
                      <div key={client.clientId} className="flex justify-between items-center text-sm">
                        <span>{client.clientName}</span>
                        <span className="font-medium">{client.orderCount} commandes</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-pink-600" />
                Commandes par Produit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {orders.ordersPerProduct.slice(0, 8).map((product) => (
                  <div key={product.productId} className="flex justify-between items-center text-sm">
                    <span className="truncate max-w-[200px]">{product.productTitle}</span>
                    <div className="text-right">
                      <span className="font-medium">{product.orderCount} commandes</span>
                      <p className="text-xs text-muted-foreground">{product.totalValue.toFixed(2)} MAD</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
