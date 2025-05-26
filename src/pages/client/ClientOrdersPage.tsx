
import React, { useEffect, useState } from "react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import MainLayout from "../../components/layouts/MainLayout";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Package, Truck, ShoppingCart } from "lucide-react";

const statusIcon = {
  pending: <Package size={18} />,
  confirmed: <ShoppingCart size={18} />,
  completed: <Truck size={18} />,
  cancelled: <span className="text-destructive font-bold">X</span>,
};

const statusColors = {
  pending: "text-yellow-500",
  confirmed: "text-blue-500",
  completed: "text-green-600",
  cancelled: "text-destructive",
};

const statusLabels = {
  pending: "En attente",
  confirmed: "Confirmée",
  completed: "Complétée",
  cancelled: "Annulée",
};

const ClientOrdersPage = () => {
  const { user } = useAuth();
  const { userOrders, loading } = useOrders();
  const { products } = useProducts();
  
  // Map product IDs to product titles for display
  const getProductTitle = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.title : "Produit inconnu";
  };

  if (!user) return <MainLayout><div className="text-red-600">Non connecté.</div></MainLayout>;

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
        {loading ? (
          <div className="text-gray-500">Chargement de vos commandes...</div>
        ) : userOrders.length === 0 ? (
          <div className="text-gray-500">Vous n'avez pas encore de commandes.</div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Statut</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Commandé le</TableHead>
                  <TableHead>Dernière mise à jour</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userOrders.map(order => {
                  const product = products.find(p => p.id === order.product_id);
                  const total = product ? (product.price * order.quantity).toFixed(2) : "N/A";
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell className={statusColors[order.status]}>
                        <div className="flex items-center gap-2">
                          {statusIcon[order.status as keyof typeof statusIcon]}
                          <span>{statusLabels[order.status as keyof typeof statusLabels]}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getProductTitle(order.product_id)}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{total} MAD</TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        {new Date(order.updated_at).toLocaleString('fr-FR')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ClientOrdersPage;
