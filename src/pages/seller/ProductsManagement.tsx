
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../components/ui/pagination';
import AddProductModal from './AddProductModal';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const ProductsManagement = () => {
  const { sellerProducts, deleteProduct, loading } = useProducts();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  const PRODUCTS_PER_PAGE = 10;

  // Seller role required
  if (!user || user.role !== 'seller') {
    return <div className="text-center p-8 text-destructive">Non autorisé.</div>;
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      const success = await deleteProduct(id);
      if (success) {
        toast.success('Produit supprimé avec succès');
      } else {
        toast.error('Échec de la suppression du produit');
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(sellerProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = sellerProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout title="Gestion des Produits">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Mes Produits
          </h2>
          <p className="text-muted-foreground mt-2">
            {sellerProducts.length} produit{sellerProducts.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          + Ajouter un Produit
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Chargement...</div>
      ) : sellerProducts.length === 0 ? (
        <Card className="border-blue-200">
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground mb-4">Vous n'avez pas encore de produits.</p>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              + Ajouter votre premier produit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="text-blue-800">
                Liste des Produits (Page {currentPage} sur {totalPages})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                      <th className="p-4 text-left text-blue-800 font-semibold">Titre</th>
                      <th className="p-4 text-right text-blue-800 font-semibold">Prix</th>
                      <th className="p-4 text-center text-blue-800 font-semibold">Créé le</th>
                      <th className="p-4 text-center text-blue-800 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((product, index) => (
                      <tr 
                        key={product.id} 
                        className={`border-b border-blue-100 hover:bg-blue-50/50 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-blue-50/20'
                        }`}
                      >
                        <td className="p-4 font-medium text-gray-900">{product.title}</td>
                        <td className="p-4 text-right font-semibold text-blue-600">
                          {product.price.toFixed(2)}€
                        </td>
                        <td className="p-4 text-center text-muted-foreground">
                          {new Date(product.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-center items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                              onClick={() => navigate(`/seller-dashboard/products/${product.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'text-blue-600 hover:bg-blue-50'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={currentPage === page}
                        className={currentPage === page 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'text-blue-600 hover:bg-blue-50'
                        }
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'text-blue-600 hover:bg-blue-50'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </DashboardLayout>
  );
};

export default ProductsManagement;
