"use client"

import type React from "react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ProductGrid from "../ProductGrid"
import type { OrderItem, Product } from "@/lib/types"

interface CategoryTabsProps {
  categoryOptions: string[]
  activeCategory: string
  setActiveCategory: (category: string) => void
  filteredProducts: Product[]
  currentOrder: OrderItem[]
  calculateSubtotal: (price: number, quantity: number, discount: number) => number
  setCurrentOrder: React.Dispatch<React.SetStateAction<OrderItem[]>>
  setNoteDialogProduct: React.Dispatch<React.SetStateAction<Product | null>>
  setNoteText: React.Dispatch<React.SetStateAction<string>>
  setCurrentItemId: React.Dispatch<React.SetStateAction<number | null>>
  setIsNoteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  orderLocked: boolean
}

export default function CategoryTabs({
  categoryOptions,
  activeCategory,
  setActiveCategory,
  filteredProducts,
  currentOrder,
  calculateSubtotal,
  setCurrentOrder,
  setNoteDialogProduct,
  setNoteText,
  setCurrentItemId,
  setIsNoteDialogOpen,
  orderLocked,
}: CategoryTabsProps) {
  return (
    <Tabs defaultValue={activeCategory} value={activeCategory} className="mb-6">
      <TabsList className="mb-4 flex flex-wrap">
        {categoryOptions.map((category) => (
          <TabsTrigger key={category} value={category} onClick={() => setActiveCategory(category)}>
            {category}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Product grid component inside TabsContent */}
      <TabsContent value={activeCategory}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => {
            const itemInOrder = currentOrder.find((item) => item.product.id === product.id)
            const quantity = itemInOrder?.quantity || 0

            return (
              <ProductGrid
                key={product.id}
                products={filteredProducts}
                activeCategory={activeCategory}
                currentOrder={currentOrder}
                calculateSubtotal={calculateSubtotal}
                setCurrentOrder={setCurrentOrder}
                setNoteDialogProduct={setNoteDialogProduct}
                setNoteText={setNoteText}
                setCurrentItemId={setCurrentItemId}
                setIsNoteDialogOpen={setIsNoteDialogOpen}
                orderLocked={orderLocked}
              />
            )
          })}
        </div>
      </TabsContent>
    </Tabs>
  )
}
