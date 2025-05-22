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
  
  const handleConfirmPayment = async (confirmedPaymentMethod?: "cash" | "qris" | "transfer") => {
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

    const payloadItems = (props.items || []).map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price * (1 - (item.product.discount || 0) / 100),
      note: item.note || "",
    }));

    const paymentMethod =
      confirmedPaymentMethod && ["cash", "qris", "transfer"].includes(confirmedPaymentMethod)
        ? confirmedPaymentMethod
        : "cash";

    console.log("✅ paymentMethod used:", paymentMethod);

    if (props.recalledOrderId) {
      await submitOrder({
        orderId: Number(props.recalledOrderId),
        action: "pay",
        order: {
          order_type: props.customerType?.toUpperCase() || "DINE-IN",
          payment_status: "unpaid",
          payment_method: paymentMethod,
          total_amount: total,
          items: payloadItems,
        },
      });
    } else {
      await submitOrder({
        items: payloadItems,
        customerType: props.customerType || "dine-in",
        paymentMethod,
        status: "paid",
        totalAmount: total,
      });
    }


    props.setRecalledOrderId?.(null);
    localStorage.removeItem("recalledOrderId");
    localStorage.removeItem("recalledOrderItems");
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
      <>
    {props.recalledOrderId && (
      <div className="bg-yellow-100 text-yellow-800 text-sm p-3 rounded border border-yellow-300 mb-2 flex justify-between items-center">
        <div>
          <strong>Recalled Held Order:</strong> You're editing a held order (ID: {props.recalledOrderId})
        </div>
        {props.setRecalledOrderId && (
          <button
            className="text-red-600 underline ml-4 text-xs"
            onClick={() => {
              props.setRecalledOrderId?.(null);
              props.onNewOrder?.();
            }}
          >
            Cancel Recall
          </button>
        )}
      </div>
    )}

    <Card className="h-full bg-white flex flex-col max-w-full">
      {paymentStep === "order" && (
        <OrderStep
          {...props}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onNext={() => setPaymentStep("payment")}
        />
      )}
      {paymentStep === "payment" && (
        <PaymentStep
          {...props}
          customerType={props.customerType ?? "pilih"}
          setCustomerType={props.setCustomerType ?? (() => {})}
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
          setPaymentMethod={setPaymentMethod}
          cashAmount={cashAmount}
          onNewOrder={() => {
            setPaymentStep("order");      
            setCashAmount("");            
            props.onNewOrder?.();         
          }}
        />
      )}
    </Card>
    </>
  );
}
