import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  unit: string;
  isPackage: boolean;
  image?: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
  subtotal: number;
  note: string;
  discount?: number;
}

interface ProductGridProps {
  products: Product[];
  activeCategory: string;
  currentOrder: OrderItem[];
  calculateSubtotal: (price: number, quantity: number, discount: number) => number;
  setCurrentOrder: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  setNoteDialogProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  setNoteText: React.Dispatch<React.SetStateAction<string>>;
  setCurrentItemId: React.Dispatch<React.SetStateAction<number | null>>;
  setIsNoteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  activeCategory,
  currentOrder,
  calculateSubtotal,
  setCurrentOrder,
  setNoteDialogProduct,
  setNoteText,
  setCurrentItemId,
  setIsNoteDialogOpen,
  orderLocked,
}) => {
  // Handle incrementing item quantity
  const handleIncrement = (productId: number) => {
    if (orderLocked) return;

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existingItem = currentOrder.find((item) => item.product.id === productId);
    if (existingItem) {
      // Update quantity if item already exists
      const updatedOrder = currentOrder.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: calculateSubtotal(
                item.product.price,
                item.quantity + 1,
                item.discount || 0
              ),
            }
          : item
      );
      setCurrentOrder(updatedOrder);
    } else {
      // Add new item to order
      const newItem: OrderItem = {
        product,
        quantity: 1,
        subtotal: product.price,
        note: "",
        discount: 0,
      };
      setCurrentOrder([...currentOrder, newItem]);
    }
  };

  // Handle decrementing item quantity
  const handleDecrement = (productId: number) => {
    if (orderLocked) return;
    const existingItem = currentOrder.find((item) => item.product.id === productId);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        // Decrease quantity
        const updatedOrder = currentOrder.map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
                subtotal: calculateSubtotal(
                  item.product.price,
                  item.quantity - 1,
                  item.discount || 0
                ),
              }
            : item
        );
        setCurrentOrder(updatedOrder);
      } else {
        // Remove item if quantity becomes 0
        const updatedOrder = currentOrder.filter((item) => item.product.id !== productId);
        setCurrentOrder(updatedOrder);
      }
    }
  };

  // Handle opening note dialog
  const handleAddNote = (product: Product) => {
    const item = currentOrder.find((item) => item.product.id === product.id);
    if (item) {
      setNoteDialogProduct(product);
      setNoteText(item.note || "");
      setCurrentItemId(product.id);
      setIsNoteDialogOpen(true);
    }
  };

  return (
    <TabsContent value={activeCategory} className="mt-0">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => {
          const itemInOrder = currentOrder.find((item) => item.product.id === product.id);
          const quantity = itemInOrder?.quantity || 0;

          return (
            <ProductCard
              key={product.id}
              product={product}
              quantity={quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onAddNote={handleAddNote}
              isInOrder={!!itemInOrder}
            />
          );
        })}
      </div>
    </TabsContent>
  );
};

export default ProductGrid;