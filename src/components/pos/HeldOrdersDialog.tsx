"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "./OrderSummary/utils/calculations";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeldOrder } from "@/lib/types";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  unit: string;
  isPackage: boolean;
  image?: string;
  discount?: number;
}


interface HeldOrdersDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  heldOrders: HeldOrder[]; // sudah difilter per halaman di SalesInterface
  recallHeldOrder: (id: string) => void;
  deleteHeldOrder: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const HeldOrdersDialog: React.FC<HeldOrdersDialogProps> = ({
  isOpen,
  setIsOpen,
  heldOrders,
  recallHeldOrder,
  deleteHeldOrder,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (orderToDelete) {
      deleteHeldOrder(orderToDelete);
      setOrderToDelete(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Held Orders</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages || 1}
            </DialogDescription>
          </DialogHeader>

          {heldOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No held orders yet.</p>
          ) : (
  heldOrders.map((order) => {
    return (
      <div
        key={order.id}
        className="p-4 border border-border rounded-md space-y-2 mb-4"
      >
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>
            <strong>Order ID:</strong> {order.id}
          </span>
          <span>
            {new Date(order.created_at).toLocaleDateString()}{" "}
            {new Date(order.created_at).toLocaleTimeString()}
          </span>
        </div>

        <div className="text-sm font-medium">
          Customer: <span className="capitalize">{order.customerType}</span>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="text-sm text-muted-foreground space-y-1 mt-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span>
                  {item.quantity}x {item.product.name}
                  {item.note && (
                    <span className="italic ml-1 text-gray-500">
                      ({item.note})
                    </span>
                  )}
                </span>
                <span>{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between font-semibold border-t pt-2 mt-2 text-sm">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={() => recallHeldOrder(order.id)}
            className="w-full"
          >
            Recall
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOrderToDelete(order.id)}
            className="w-full"
          >
            Delete
          </Button>
          </div>
                </div>
              );
            })
          )}


            
          <DialogFooter className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!orderToDelete}
        onOpenChange={(open) => !open && setOrderToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order? This will change the
              payment status from "unpaid" to "canceled" in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HeldOrdersDialog;
