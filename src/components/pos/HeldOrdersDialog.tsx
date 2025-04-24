"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "./OrderSummary/utils/calculations";

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
  note?: string;
  discount?: number;
}

interface HeldOrder {
  id: string; // bisa dari backend (angka) atau frontend (string)
  timestamp: string;
  total: number;
  customerType: string;
  items: OrderItem[];
  discountInfo?: {
    type: "percentage" | "nominal";
    value: string;
  };
}

interface HeldOrdersDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  heldOrders: HeldOrder[];
  recallHeldOrder: (id: string) => void;
  deleteHeldOrder: (id: string) => void;
}

const HeldOrdersDialog: React.FC<HeldOrdersDialogProps> = ({
  isOpen,
  setIsOpen,
  heldOrders,
  recallHeldOrder,
  deleteHeldOrder,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Held Orders</DialogTitle>
        </DialogHeader>

        {heldOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No held orders yet.</p>
        ) : (
          heldOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 border border-border rounded-md space-y-2 mb-4"
            >
              <div className="text-xs text-muted-foreground flex justify-between">
                <span><strong>Order ID:</strong> {order.id}</span>
                <span>{order.timestamp}</span>
              </div>

              <div className="text-sm font-medium">
                Customer: <span className="capitalize">{order.customerType}</span>
              </div>

              <div className="text-sm">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.product.name}
                      {item.note && <em className="ml-1 text-xs">({item.note})</em>}
                    </span>
                    <span>{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-semibold border-t pt-2 mt-2 text-sm">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => recallHeldOrder(order.id)} className="w-full">
                  Recall
                </Button>
                <Button size="sm" variant="outline" onClick={() => deleteHeldOrder(order.id)} className="w-full">
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HeldOrdersDialog;
