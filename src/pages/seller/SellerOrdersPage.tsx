
import React from "react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, ShoppingCart, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusIcon = {
  pending: <Package size={18} />,
  confirmed: <ShoppingCart size={18} />,
  completed: <Truck size={18} />,
  cancelled: <X size={18} className="text-destructive" />,
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "En attente",
  confirmed: "Confirmée",
  completed: "Complétée",
  cancelled: "Annulée",
};

const SellerOrdersPage = () => {
  const { user } = useAuth();
  const { sellerOrders, loading, updateOrderStatus } = useOrders();
  const { products } = useProducts();
  
  const getProductTitle = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.title : "Produit inconnu";
  };

  const handleUpdateStatus = async (orderId: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    await updateOrderStatus(orderId, newStatus);
  };

  if (!user || user.role !== 'seller') {
    return <div className="text-center p-8 text-destructive">Non autorisé.</div>;
  }

  return (
    <DashboardLayout title="Commandes de Vente">
      <div className="container mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Commandes Clients</h1>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Chargement des commandes...</div>
        ) : sellerOrders.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Vous n'avez pas encore de commandes.
          </div>
        ) : (
          <div className="overflow-x-auto rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Commande</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellerOrders.map(order => {
                  const product = products.find(p => p.id === order.product_id);
                  const total = product ? (product.price * order.quantity).toFixed(2) : "N/A";
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>{getProductTitle(order.product_id)}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{total}€</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[order.status]}>
                          <span className="flex items-center gap-1">
                            {statusIcon[order.status as keyof typeof statusIcon]}
                            <span>{statusLabels[order.status as keyof typeof statusLabels]}</span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleString('fr-FR')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-blue-500 text-blue-500 hover:bg-blue-50"
                              onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                            >
                              Confirmer
                            </Button>
                          )}
                          {order.status === 'confirmed' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-green-500 text-green-500 hover:bg-green-50"
                              onClick={() => handleUpdateStatus(order.id, 'completed')}
                            >
                              Terminer
                            </Button>
                          )}
                          {(order.status === 'pending' || order.status === 'confirmed') && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-500 text-red-500 hover:bg-red-50"
                              onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                            >
                              Annuler
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SellerOrdersPage;
