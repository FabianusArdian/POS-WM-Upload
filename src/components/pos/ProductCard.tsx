import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  unit: string;
  isPackage: boolean;
  image?: string;
}

interface ProductCardProps {
  product: Product;
  quantity: number;
  onIncrement: (productId: number) => void;
  onDecrement: (productId: number) => void;
  onAddNote: (product: Product) => void;
  isInOrder: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onIncrement,
  onDecrement,
  onAddNote,
  isInOrder,
}) => {
  return (
    <Card key={product.id} className="overflow-hidden">
      {product.image && (
        <div className="relative w-full h-32 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-base">{product.name}</CardTitle>
          {product.isPackage && <Badge variant="secondary">Package</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{product.unit}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col items-center justify-between">
          <p className="font-small">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(product.price)}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onIncrement(product.id)}
            >
              +
            </Button>
            <span className="text-sm font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={!isInOrder || quantity <= 0}
              onClick={() => onDecrement(product.id)}
            >
              -
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    disabled={!isInOrder}
                    onClick={() => onAddNote(product)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add note</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;