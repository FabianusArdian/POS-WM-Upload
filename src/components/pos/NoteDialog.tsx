import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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

interface NoteDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  noteDialogProduct: Product | null;
  noteText: string;
  setNoteText: React.Dispatch<React.SetStateAction<string>>;
  currentItemId: number | null;
  setNoteDialogProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  setCurrentItemId: React.Dispatch<React.SetStateAction<number | null>>;
  currentOrder: OrderItem[];
  setCurrentOrder: React.Dispatch<React.SetStateAction<OrderItem[]>>;
}

const NoteDialog: React.FC<NoteDialogProps> = ({
  isOpen,
  setIsOpen,
  noteDialogProduct,
  noteText,
  setNoteText,
  currentItemId,
  setNoteDialogProduct,
  setCurrentItemId,
  currentOrder,
  setCurrentOrder,
}) => {
  const handleCancel = () => {
    setIsOpen(false);
    setNoteText("");
    setNoteDialogProduct(null);
    setCurrentItemId(null);
  };

  const handleSave = () => {
    if (currentItemId) {
      const updatedOrder = currentOrder.map((item) =>
        item.product.id === currentItemId
          ? {
              ...item,
              note: noteText,
            }
          : item
      );
      setCurrentOrder(updatedOrder);
    }
    handleCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {noteDialogProduct
              ? `Add Note for ${noteDialogProduct.name}`
              : "Add Note"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="Special instructions..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;