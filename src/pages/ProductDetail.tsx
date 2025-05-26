
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/layouts/MainLayout';
import { Button } from '../components/ui/button';
import { 
  Card, 
  CardContent 
} from '../components/ui/card';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Plus, 
  Minus 
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import BuyNowModal from "../components/BuyNowModal";
import { useOrders } from "../context/OrderContext";
import { toast } from "@/hooks/use-toast";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, products, loading } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { placeOrder } = useOrders();
  const [quantity, setQuantity] = useState(1);
  const [buyNowOpen, setBuyNowOpen] = useState(false);

  const product = id ? getProduct(id) : undefined;
  const relatedProducts = product 
    ? products
        .filter(p => 
          p.id !== product.id && 
          p.keywords.some(keyword => product.keywords.includes(keyword))
        )
        .slice(0, 3)
    : [];

  if (loading) {
    return (
      <MainLayout>
        <div className="sahara-container">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="aspect-square bg-blue-100 rounded-lg"></div>
              </div>
              <div className="md:w-1/2">
                <div className="h-8 bg-blue-100 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-blue-100 rounded w-1/2 mb-6"></div>
                <div className="h-24 bg-blue-100 rounded mb-6"></div>
                <div className="h-8 bg-blue-100 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-blue-100 rounded w-full mb-6"></div>
                <div className="h-12 bg-blue-100 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="sahara-container text-center py-12">
          <h2 className="text-2xl font-heading font-semibold mb-4">Produit Non Trouvé</h2>
          <p className="text-muted-foreground mb-6">
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button onClick={() => navigate('/products')} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Produits
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    addToCart(product, quantity);
    toast({
      title: "Ajouté au panier!",
      description: `${quantity} ${quantity === 1 ? 'unité' : 'unités'} de ${product.title} ajouté au panier!`,
      variant: "default"
    });
  };

  const handleBuyNow = async (buyQty: number, address: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    const order = await placeOrder(buyQty, address, product.id);
    if (order) {
      toast({
        title: "Commande passée!",
        description: `Vous avez acheté ${buyQty} × ${product.title}. Livraison à: ${address}`,
        variant: "default"
      });
    } else {
      toast({
        title: "Échec de la commande",
        description: "Impossible de finaliser votre commande. Réessayez.",
        variant: "destructive"
      });
    }
  };

  return (
    <MainLayout>
      <div className="sahara-container">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-muted-foreground hover:text-blue-600"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Retour aux Produits
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-1/2">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border border-blue-200 shadow-lg">
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full h-full object-contain p-4"
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <h1 className="text-3xl font-heading font-semibold mb-2 bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              {product.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                  {keyword}
                </Badge>
              ))}
            </div>
            <p className="text-lg font-semibold text-blue-700 mb-6">
              {product.price.toFixed(2)} MAD
            </p>
            <div className="border-t border-b border-blue-200 py-6 mb-6">
              <h3 className="font-medium mb-2 text-blue-800">Description</h3>
              <p className="text-muted-foreground">
                {product.description}
              </p>
            </div>
            <div className="flex items-center mb-6">
              <span className="mr-4 text-blue-800">Quantité:</span>
              <div className="flex items-center border border-blue-200 rounded-md">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-blue-800">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <Button 
                size="lg" 
                onClick={handleAddToCart}
                className="w-full md:w-auto px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au Panier
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full md:w-auto px-8 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-800 border border-blue-300"
                onClick={() => setBuyNowOpen(true)}
              >
                Acheter Maintenant
              </Button>
            </div>
          </div>
        </div>
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-heading font-semibold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Produits Similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="product-card overflow-hidden group border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-200">
                  <div className="overflow-hidden">
                    <img 
                      src={relatedProduct.imageUrl} 
                      alt={relatedProduct.title} 
                      className="product-image h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-1 truncate text-blue-800">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                      {relatedProduct.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-blue-700">
                        {relatedProduct.price.toFixed(2)} MAD
                      </span>
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <a href={`/products/${relatedProduct.id}`}>Voir</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      <BuyNowModal
        open={buyNowOpen}
        onClose={() => setBuyNowOpen(false)}
        onBuy={handleBuyNow}
        productTitle={product.title}
      />
    </MainLayout>
  );
};

export default ProductDetail;
