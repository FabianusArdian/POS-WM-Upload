"use client";

import { useEffect } from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { OrderStep } from "./views/OrderStep";
import { PaymentStep } from "./views/PaymentStep";
import { ConfirmationStep } from "./views/ConfirmationStep";
import { ReceiptStep } from "./views/ReceiptStep";
import type { OrderSummaryProps } from "./types";
import { submitOrder } from "@/lib/helpers/order";
import {
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
} from "./utils/calculations";

export default function OrderSummary({
  paymentMethod,
  setPaymentMethod,
  ...props
}: OrderSummaryProps & {
  paymentMethod: "cash" | "qris" | "transfer";
  setPaymentMethod: (method: "cash" | "qris" | "transfer") => void;
}) {
  const [paymentStep, setPaymentStep] = useState<
    "order" | "payment" | "confirmation" | "receipt"
  >("order");

  const [cashAmount, setCashAmount] = useState<string>("");
  const handleConfirmPayment = async () => {
    try {
      const subtotal = calculateSubtotal(props.items || []);
      const discountAmount = calculateDiscount(
        props.discountInfo?.type || "percentage",
        props.discountInfo?.value || "0",
        subtotal
      );
      const subtotalAfterDiscount = subtotal - discountAmount;
      const tax = calculateTax(subtotalAfterDiscount);
      const total = subtotalAfterDiscount + tax;
  
      await submitOrder({
        items: (props.items || []).map((item) => ({
          product: { id: item.id, price: item.price, name: item.name },
          quantity: item.quantity,
          note: item.note || "",
        })),
        customerType: props.customerType || "pilih",
        paymentMethod: paymentMethod,
        status: "paid",
        totalAmount: total,
      });
  
      setPaymentStep("receipt");
    } catch (err: any) {
      alert("Gagal menyimpan transaksi: " + err.message);
    }
  };

  useEffect(() => {
    if (paymentStep === "payment" || paymentStep === "receipt") {
      props.setOrderLocked?.(true); // 🔒 Kunci saat pembayaran
    } else {
      props.setOrderLocked?.(false); // 🔓 Buka saat kembali ke step awal
    }
  }, [paymentStep]);

  return (
    <Card className="h-full bg-white flex flex-col max-w-full">
      {paymentStep === "order" && (
        <OrderStep {...props} onNext={() => setPaymentStep("payment")} />
      )}
      {paymentStep === "payment" && (
        <PaymentStep
          {...props}
          customerType={props.customerType}
          setCustomerType={props.setCustomerType}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          cashAmount={cashAmount}
          setCashAmount={setCashAmount}
          onBack={() => setPaymentStep("order")}
          onConfirm={handleConfirmPayment}
        />
      )}
      {paymentStep === "confirmation" && (
        <ConfirmationStep onDone={() => setPaymentStep("receipt")} />
      )}
      {paymentStep === "receipt" && (
        <ReceiptStep
          {...props}
          paymentMethod={paymentMethod}
          cashAmount={cashAmount}
          onNewOrder={() => {
            setPaymentStep("order");      
            setCashAmount("");            
            props.onNewOrder?.();         
          }}
        />
      )}
    </Card>
  );
}
