
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layouts/MainLayout";
import { Button } from "../components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useOrders } from "../context/OrderContext";
import { Separator } from "../components/ui/separator";
import CartItem from "../components/cart/CartItem";
import CheckoutModal from "../components/checkout/CheckoutModal";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: "/cart" } });
      return;
    }

    if (cart.items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Veuillez ajouter des articles à votre panier avant de passer commande.",
        variant: "destructive",
      });
      return;
    }

    setCheckoutOpen(true);
  };

  const handlePlaceOrder = async (address: string) => {
    setIsSubmitting(true);

    try {
      // Process one item at a time
      const firstItem = cart.items[0];
      const order = await placeOrder(firstItem.quantity, address, firstItem.product.id);
      
      if (order) {
        toast({
          title: "Commande passée avec succès !",
          description: `Votre commande pour ${firstItem.quantity} × ${firstItem.product.title} a été passée.`,
          variant: "default"
        });
        removeFromCart(firstItem.product.id);
        
        // If this was the last item, close the dialog and navigate to orders
        if (cart.items.length <= 1) {
          setCheckoutOpen(false);
          navigate("/client-dashboard/orders");
        }
      } else {
        toast({
          title: "Échec de la commande",
          description: "Impossible de terminer votre commande. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur de commande:", error);
      toast({
        title: "Échec de la commande",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="sahara-container py-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCart className="h-7 w-7" />
          Panier
          <span className="ml-3 text-base text-muted-foreground font-normal">{totalItems} article{totalItems !== 1 && 's'}</span>
        </h1>
        
        {cart.items.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Votre panier est vide.
            <div className="mt-6">
              <Button onClick={() => navigate("/products")}>Retour aux Produits</Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5 grid gap-4">
              {cart.items.map(item => (
                <CartItem 
                  key={item.product.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>

            <div className="mt-8 bg-muted/20 p-4 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Résumé de la commande</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Sous-total ({totalItems} articles)</span>
                  <span>{cart.total.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (estimées)</span>
                  <span>{(cart.total * 0.07).toFixed(2)} MAD</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{(cart.total * 1.07).toFixed(2)} MAD</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-4 mt-8">
              <div className="mb-4 md:mb-0">
                <Button onClick={clearCart} variant="outline">Vider le panier</Button>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => navigate("/products")} variant="outline">
                  Continuer les achats
                </Button>
                <Button onClick={handleCheckout} size="lg" className="btn-primary">
                  Passer commande
                </Button>
              </div>
            </div>
          </div>
        )}

        <CheckoutModal
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          onCheckout={handlePlaceOrder}
          isSubmitting={isSubmitting}
        />
      </div>
    </MainLayout>
  );
};

export default CartPage;
