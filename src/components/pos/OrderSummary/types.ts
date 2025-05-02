import { OrderItem } from "@/lib/types";

  
  export interface OrderSummaryProps {
    items?: OrderItem[];
    setCurrentOrder?: React.Dispatch<React.SetStateAction<OrderItem[]>>;
    onCheckout?: () => void;
    onCancelOrder?: () => void;
    onUpdateQuantity?: (id: number, quantity: number) => void;
    onRemoveItem?: (id: number) => void;
    customerType?: "pilih" | "dine-in" | "grab" | "gojek" | "shopee";
    setCustomerType?: (type: string) => void;
    discountInfo?: {
      type: "percentage" | "nominal";
      value: string;
    };
    paymentMethod: "cash" | "qris" | "transfer";
    setPaymentMethod: (method: "cash" | "qris" | "transfer") => void;
    onUpdateDiscountType?: (type: "percentage" | "nominal") => void;
    onUpdateDiscountValue?: (value: string) => void;
    setOrderLocked?: (locked: boolean) => void;
    onNewOrder?: () => void;
    
  }
  