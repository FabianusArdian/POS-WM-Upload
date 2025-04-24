export interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    note?: string;
    discount?: number;
  }
  
  export interface OrderSummaryProps {
    items?: OrderItem[];
    onCheckout?: () => void;
    onCancelOrder?: () => void;
    onUpdateQuantity?: (id: number, quantity: number) => void;
    onRemoveItem?: (id: number) => void;
    customerType?: "pilih" | "dine-in" | "grab" | "gojek" | "shopee";
    discountInfo?: {
      type: "percentage" | "nominal";
      value: string;
    };
    paymentMethod: "cash" | "qris" | "transfer";
    setPaymentMethod: (method: "cash" | "qris" | "transfer") => void;
    onUpdateDiscountType?: (type: "percentage" | "nominal") => void;
    onUpdateDiscountValue?: (value: string) => void;
  }
  