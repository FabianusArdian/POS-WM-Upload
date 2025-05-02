"use client";

import {
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QrCode, Banknote, CreditCard } from "lucide-react";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { formatCurrency, calculateDiscount, calculateSubtotal, calculateTax } from "../utils/calculations";
import { OrderSummaryProps } from "../types";

interface PaymentStepProps extends OrderSummaryProps {
  customerType: "pilih" | "dine-in" | "grab" | "gojek" | "shopee";
  setCustomerType: (type: string) => void;
  paymentMethod: "cash" | "qris" | "transfer";
  setPaymentMethod: (method: "cash" | "qris" | "transfer") => void;
  cashAmount: string;
  setCashAmount: (amount: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export function PaymentStep({
  items = [],
  customerType = "pilih",
  setCustomerType,
  discountInfo = { type: "percentage", value: "" },
  onUpdateDiscountType = () => {},
  onUpdateDiscountValue = () => {},
  paymentMethod,
  setPaymentMethod,
  cashAmount,
  setCashAmount,
  onBack,
  onConfirm
}: PaymentStepProps) {
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculateDiscount(discountInfo.type, discountInfo.value, subtotal);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = calculateTax(subtotalAfterDiscount);
  const total = subtotalAfterDiscount + tax;

  const calculateChange = () => {
    const amount = parseFloat(cashAmount) || 0;
    return Math.max(0, amount - total);
  };

  return (
    <>
      <CardContent className="flex-grow">
        <h3 className="text-lg font-semibold mb-4">Customer Type</h3>
        <div className="mb-6">
        <Select value={customerType} onValueChange={(value) => setCustomerType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select customer type" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="pilih">Pilih</SelectItem>
              <SelectItem value="dine-in">Dine In</SelectItem>
              <SelectItem value="grab">Grab</SelectItem>
              <SelectItem value="gojek">Gojek</SelectItem>
              <SelectItem value="shopee">Shopee</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <h3 className="text-lg font-semibold mb-4">Order Discount</h3>
        <div className="mb-4 space-y-2">
          <RadioGroup
              value={discountInfo?.type || "percentage"}
              onValueChange={(value) => onUpdateDiscountType(value as "percentage" | "nominal")}
              className="flex gap-2"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage">Percentage (%)</Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="nominal" id="nominal" />
              <Label htmlFor="nominal">Nominal (Rp)</Label>
            </div>
          </RadioGroup>
          <Input
                type="number"
                placeholder={
                    discountInfo?.type === "percentage"
                    ? "Enter discount %"
                    : "Enter discount amount"
                }
                value={discountInfo?.value || ""}
                onChange={(e) => onUpdateDiscountValue(e.target.value)}
                min="0"
                max={discountInfo?.type === "percentage" ? "100" : undefined}
                />
        </div>

        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as "cash" | "qris" | "transfer")}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="flex items-center cursor-pointer">
              <Banknote className="mr-2 h-5 w-5" />
              Cash
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <RadioGroupItem value="qris" id="qris" />
            <Label htmlFor="qris" className="flex items-center cursor-pointer">
              <QrCode className="mr-2 h-5 w-5" />
              QRIS
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <RadioGroupItem value="transfer" id="transfer" />
            <Label htmlFor="transfer" className="flex items-center cursor-pointer">
              <CreditCard className="mr-2 h-5 w-5" />
              Transfer
            </Label>
          </div>
        </RadioGroup>

        <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span>Discount</span>
                <span>-{formatCurrency(discountAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span>Tax (10%)</span>
                <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t mt-2 pt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
            </div>
        </div>

        {paymentMethod === "cash" && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="cash-amount">Cash Amount</Label>
            <Input
              id="cash-amount"
              type="number"
              placeholder="Enter amount"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
            />
            {parseFloat(cashAmount) >= total && (
              <div className="mt-2">
                <Label>Change</Label>
                <div className="text-lg font-semibold">{formatCurrency(calculateChange())}</div>
              </div>
            )}
          </div>
        )}

        {paymentMethod === "qris" && (
          <div className="mt-4 flex flex-col items-center">
            <div className="bg-gray-200 w-48 h-48 flex items-center justify-center mb-2">
              <QrCode size={120} />
            </div>
            <p className="text-sm text-center">Scan this QR code to pay {formatCurrency(total)}</p>
          </div>
        )}

        {paymentMethod === "transfer" && (
          <div className="mt-4 space-y-2">
            <div className="border rounded-md p-3">
              <p className="font-medium">Bank Transfer Details</p>
              <p className="text-sm">Bank: BCA</p>
              <p className="text-sm">Account: 1234567890</p>
              <p className="text-sm">Name: Warung Makan</p>
              <p className="text-sm font-medium mt-2">Amount: {formatCurrency(total)}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col border-t pt-4">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={onConfirm}
            disabled={paymentMethod === "cash" && (!cashAmount || parseFloat(cashAmount) < total)}
          >
            Confirm Payment
          </Button>
        </div>
      </CardFooter>
    </>
  );
}
