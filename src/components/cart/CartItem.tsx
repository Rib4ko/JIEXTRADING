
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash } from "lucide-react";
import { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <Card className="flex flex-col md:flex-row items-center gap-4 p-4">
      <img
        src={item.product.imageUrl}
        alt={item.product.title}
        className="w-28 h-28 object-cover rounded border"
      />
      <CardContent className="flex-1 flex flex-col md:flex-row md:items-center gap-4 p-0 md:p-4">
        <div className="flex-1">
          <div className="font-semibold text-lg">{item.product.title}</div>
          <div className="text-muted-foreground text-sm line-clamp-2">{item.product.description}</div>
          <div className="text-blue-700 font-medium mt-2">{item.product.price.toFixed(2)} MAD</div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-9 text-center">{item.quantity}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => removeFromCart(item.product.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
