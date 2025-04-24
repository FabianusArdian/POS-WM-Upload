"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, MessageSquare } from "lucide-react";
import { formatCurrency, calculateSubtotal, calculateDiscount, calculateTax } from "../utils/calculations";
import { OrderSummaryProps } from "../types";

export function OrderStep({
  items = [],
  onCancelOrder = () => {},
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  customerType = "pilih",
  discountInfo = { type: "percentage", value: "" },
  onNext
}: OrderSummaryProps & { onNext: () => void }) {
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculateDiscount(discountInfo.type, discountInfo.value, subtotal);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = calculateTax(subtotalAfterDiscount);
  const total = subtotalAfterDiscount + tax;

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>No items in order</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  {item.note && (
                    <div className="flex items-center gap-1 mt-1">
                      <MessageSquare className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs italic text-muted-foreground">
                        {item.note}
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => onRemoveItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="flex-col border-t pt-4">
        <div className="w-full space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {customerType !== "pilih" && (
            <div className="flex justify-between">
              <span>Customer Type</span>
              <span className="capitalize">{customerType}</span>
            </div>
          )}
          {discountInfo.value && (
            <div className="flex justify-between text-green-600">
              <span>{discountInfo.type === "percentage" ? `Discount (${discountInfo.value}%)` : `Discount (Fixed)`}</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full mt-4">
          <Button variant="outline" onClick={onCancelOrder}>
            Cancel Order
          </Button>
          <Button onClick={onNext} disabled={items.length === 0}>
            Checkout
          </Button>
        </div>
      </CardFooter>
    </>
  );
}
