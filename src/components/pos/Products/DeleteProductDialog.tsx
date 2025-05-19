"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

interface Product {
  id: number
  name: string
  price: number
  category: string
  unit: string
  is_package: boolean
  image?: string
}

interface DeleteProductDialogProps {
  isOpen: boolean
  onClose: () => void
  currentProduct: Product | null
  onDeleteProduct: () => Promise<void>
}

export default function DeleteProductDialog({
  isOpen,
  onClose,
  currentProduct,
  onDeleteProduct,
}: DeleteProductDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{currentProduct?.name || "this product"}</span>? This action cannot be
            undone.
          </p>
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDeleteProduct}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
