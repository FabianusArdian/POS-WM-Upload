"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface ProductsHeaderProps {
  onAddProduct: () => void
}

export default function ProductsHeader({ onAddProduct }: ProductsHeaderProps) {
  return (
    <header className="border-b bg-card p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Product Management</h1>
        <Button onClick={onAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
    </header>
  )
}
