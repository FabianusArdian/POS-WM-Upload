export interface Order {
  id: number;
  order_number: string;
  timestamp: string;
  order_type: string;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  paid_at: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
  note: string;
  product: Product;
}

export interface OrderDetail extends Omit<Order, 'timestamp'> {
  items: OrderItem[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  unit: string;
  isPackage: boolean;
  image?: string;
}
export interface HeldOrder {
  id: string;
  items: OrderItem[];
  timestamp: string;
  total: number;
  customerType: "dine-in" | "grab" | "gojek" | "shopee";
  discountInfo?: {
    type: "percentage" | "nominal";
    value: string;
  };
}

export type CustomerType = "pilih" | "dine-in" | "grab" | "gojek" | "shopee";
export type DiscountType = "percentage" | "nominal";
