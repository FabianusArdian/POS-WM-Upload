"use client"

import { Button } from "@/components/ui/button"
import { List } from "lucide-react"

interface OrderActionsProps {
  processOrder: () => Promise<void>
  currentOrderLength: number
  recalledOrderId: string | null
  setIsHeldOrdersDialogOpen: (isOpen: boolean) => void
  heldOrdersCount: number
}

export default function OrderActions({
  processOrder,
  currentOrderLength,
  recalledOrderId,
  setIsHeldOrdersDialogOpen,
  heldOrdersCount,
}: OrderActionsProps) {
  return (
    <div className="p-4 border-b flex justify-between items-center">
      <h2 className="text-lg font-semibold sm:text-sm md:text-md">Current Order</h2>
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={processOrder}
          disabled={currentOrderLength === 0 || !!recalledOrderId}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Process Order
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsHeldOrdersDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <List className="h-4 w-4" />
          Orders ({heldOrdersCount})
        </Button>
      </div>
    </div>
  )
}
