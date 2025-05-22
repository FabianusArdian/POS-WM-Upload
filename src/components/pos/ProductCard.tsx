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
  discount?: number;
  status?: string;
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
    console.log("ProductCard", product),
    (
      
        <Card
          key={product.id}
          className="overflow-hidden"
        >
        {product.image && (
         <div className={`relative w-full h-32 overflow-hidden }`}>
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover ${product.status !== "active" ? "grayscale" : ""}`}
          />
          {product.status !== "active" && (
            <Badge
              variant="outline"
              className="absolute top-2 right-2 bg-white/90 border-gray-300 text-red-500 text-xs font-medium shadow-sm"
            >
              Inactive
            </Badge>
          )}
        </div>
        )}
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{product.unit}</p>
            </div>
            <div className="flex flex-col items-end space-y-1">
              {product.isPackage && <Badge variant="secondary">Package</Badge>}
              {typeof product.discount === "number" && product.discount > 0 && (
                <Badge variant="destructive">-{product.discount}%</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent  className={`p-4 pt-0 ${product.status !== "active" ? "grayscale" : ""}`}>
          <div className="flex flex-col justify-between items-start gap-3">
            <div className="w-full">
              {typeof product.discount === "number" && product.discount > 0 ? (
                <>
                  <p className="text-xs text-muted-foreground line-through">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(product.price)}
                  </p>
                  <p className="text-base font-bold text-red-600 leading-none">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(product.price * (1 - product.discount / 100))}
                  </p>
                  <p className="text-[11px] text-green-600 font-medium mt-0.5">
                    Hemat Rp{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "decimal",
                    }).format(product.price * (product.discount / 100))}
                  </p>
                </>
              ) : (
                <p className="text-base font-semibold leading-none">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(product.price)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onIncrement(product.id)}
                disabled={product.status !== "active"}
              >
                +
              </Button>
              <span className="text-sm font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={!isInOrder || quantity <= 0 || product.status !== "active"}
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
    )
  );
};

export default ProductCard;
