
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Minus, Plus, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";

interface BuyNowModalProps {
  open: boolean;
  onClose: () => void;
  onBuy: (quantity: number, address: string) => Promise<void>;
  productTitle: string;
}

const BuyNowModal: React.FC<BuyNowModalProps> = ({
  open,
  onClose,
  onBuy,
  productTitle,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");

  const handleBuy = async () => {
    setError("");
    if (!address.trim()) {
      setError("L'adresse est requise");
      return;
    }
    setBuying(true);
    try {
      await onBuy(quantity, address);
      onClose();
    } catch (e) {
      setError("Échec de l'achat. Veuillez réessayer plus tard.");
      console.error("Buy now error:", e);
    }
    setBuying(false);
  };

  // Simple Dialog UI using shadcn styles & Radix structure
  return (
    <Dialog open={open} onOpenChange={open ? onClose : undefined}>
      <DialogContent className="max-w-sm w-full bg-background p-6 rounded-lg shadow-lg border">
        <DialogTitle className="mb-2 text-lg font-medium">Acheter {productTitle}</DialogTitle>
        <DialogDescription className="mb-4 text-muted-foreground">
          Sélectionnez la quantité et fournissez l'adresse de livraison pour finaliser votre achat.
        </DialogDescription>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Quantité:</label>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus />
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus />
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Adresse:</label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Entrez votre adresse de livraison"
            disabled={buying}
          />
        </div>
        {error && (
          <div className="text-destructive mb-3 text-sm flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div className="flex gap-2">
          <Button onClick={handleBuy} disabled={buying} className="flex-1 bg-blue-600 hover:bg-blue-700">
            {buying ? "Traitement..." : "Acheter"}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={buying} className="flex-1">
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyNowModal;
