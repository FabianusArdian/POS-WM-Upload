import { Button } from "@/components/ui/button";
import { List } from "lucide-react";

interface OrderHeaderProps {
  onProcessOrder: () => void;
  onViewHeldOrders: () => void;
  heldOrdersCount: number;
  recalledOrderId?: string | null;
}

export default function OrderHeader({
  onProcessOrder,
  onViewHeldOrders,
  heldOrdersCount,
  recalledOrderId
}: OrderHeaderProps) {
  return (
    <div className="p-4 border-b flex justify-between items-center">
      <h2 className="text-lg font-semibold sm:text-sm md:text-md">
        Current Order
      </h2>
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={onProcessOrder}
          disabled={!recalledOrderId}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Process Order
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewHeldOrders}
          className="flex items-center gap-1"
        >
          <List className="h-4 w-4" />
          Orders ({heldOrdersCount})
        </Button>
      </div>
    </div>
  );
}