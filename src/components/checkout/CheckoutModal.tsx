
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onCheckout: (address: string) => Promise<void>;
  isSubmitting: boolean;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  open,
  onClose,
  onCheckout,
  isSubmitting
}) => {
  const [address, setAddress] = useState("");

  const handleSubmit = async () => {
    if (address.trim()) {
      await onCheckout(address);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription>
            Enter your shipping address to complete the checkout process.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="address">Shipping Address</Label>
            <Input
              id="address"
              placeholder="Enter your full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          
          <div className="bg-muted p-3 rounded-md flex items-center text-sm">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
            <span>
              For demo purposes, this will process only the first item in your cart.
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            className="btn-primary" 
            disabled={isSubmitting || !address.trim()}
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
