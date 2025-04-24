"use client";

import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, calculateSubtotal, calculateDiscount, calculateTax } from "../utils/calculations";
import { OrderSummaryProps } from "../types";

interface ReceiptStepProps extends OrderSummaryProps {
  paymentMethod: "cash" | "qris" | "transfer";
  cashAmount: string;
  onNewOrder: () => void;
}

export function ReceiptStep({
  items = [],
  discountInfo = { type: "percentage", value: "" },
  paymentMethod,
  cashAmount,
  onNewOrder
}: ReceiptStepProps) {
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculateDiscount(discountInfo.type, discountInfo.value, subtotal);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = calculateTax(subtotalAfterDiscount);
  const total = subtotalAfterDiscount + tax;
  const change = Math.max(0, (parseFloat(cashAmount) || 0) - total);

  return (
    <>
      <CardContent className="flex-grow overflow-auto">
        <div id="receipt-print" className="border rounded-md p-4 mb-4">
          <div className="text-center mb-4">
            <h3 className="font-bold text-xl">Warung Makan</h3>
            <p className="text-sm text-muted-foreground">Jl. Contoh No. 123, Jakarta</p>
            <p className="text-sm text-muted-foreground">Tel: 021-1234567</p>
            <p className="text-xs text-muted-foreground mt-1">{new Date().toLocaleString()}</p>
          </div>
          <Separator className="my-2" />
          <div className="space-y-2 mb-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div>
                  <span>{item.quantity}x {item.name}</span>
                  {item.note && <span className="text-xs italic ml-1">({item.note})</span>}
                </div>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-2" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            {discountInfo.value && (
              <div className="flex justify-between">
                <span>{discountInfo.type === "percentage" ? `Discount (${discountInfo.value}%)` : `Discount (Fixed)`}</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between"><span>Tax (10%)</span><span>{formatCurrency(tax)}</span></div>
            <div className="flex justify-between font-bold mt-2"><span>Total</span><span>{formatCurrency(total)}</span></div>
            {paymentMethod === "cash" && (
              <>
                <div className="flex justify-between mt-2"><span>Cash</span><span>{formatCurrency(parseFloat(cashAmount) || 0)}</span></div>
                <div className="flex justify-between"><span>Change</span><span>{formatCurrency(change)}</span></div>
              </>
            )}
          </div>
          <div className="text-center mt-4 text-xs text-muted-foreground">
            <p>Payment Method: {paymentMethod.toUpperCase()}</p>
            <p className="mt-2">Thank you for your purchase!</p>
            <p>Please come again</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col border-t pt-4">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button variant="outline" onClick={onNewOrder}>New Order</Button>
          <Button onClick={() => window.print()}>Print Receipt</Button>
        </div>
      </CardFooter>
    </>
  );
}
