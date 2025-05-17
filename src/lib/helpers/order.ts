import { ordersAPI } from "@/lib/api";
import { getCurrentUserId } from "@/lib/utils";

interface OrderItemPayload {
  product_id: number;
  quantity: number;
  price: number;
  note?: string;
}

interface RecallOrderPayload {
  order_type: string;
  payment_status: "unpaid";
  payment_method: string;
  total_amount: number;
  created_by?: number;
  items: OrderItemPayload[];
}

export interface SubmitOrderParams {
  items?: OrderItemPayload[];
  customerType?: string;
  paymentMethod?: string;
  status?: string;
  totalAmount?: number;

  orderId?: number;
  action?: "pay";
  order?: RecallOrderPayload;
}

export async function submitOrder(params: SubmitOrderParams) {
  const userId = getCurrentUserId() || 0;

  if (params.orderId && params.action === "pay" && params.order) {
    return await ordersAPI.create({
      order_id: params.orderId,
      action: "pay",
      order: {
        ...params.order,
        created_by: params.order.created_by ?? userId,
      },
    });
  }
  console.log("submitOrder params", {
  items: params.items,
  totalAmount: params.totalAmount,
  status: params.status,
  paymentMethod: params.paymentMethod,
  customerType: params.customerType,
});
  if (!params.items || !params.totalAmount || !params.status || !params.paymentMethod || !params.customerType) {
    throw new Error("Missing required field for new order.");
  }

  return await ordersAPI.create({
    order: {
      order_type: params.customerType.toUpperCase(),
      payment_status: params.status,
      payment_method: params.paymentMethod,
      total_amount: params.totalAmount,
      created_by: userId,
      items: params.items,
    },
  });
}
