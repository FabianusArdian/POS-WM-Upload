import { ordersAPI } from "@/lib/api";
import { getCurrentUserId } from "@/lib/utils";
import { OrderItem } from "@/lib/types";

interface SubmitOrderParams {
  items: OrderItem[];
  customerType: string;
  paymentMethod?: string;
  status: "unpaid" | "paid";
  action?: "pay";
  orderId?: number;
  totalAmount: number;
}

export async function submitOrder({
  items,
  customerType,
  paymentMethod,
  status,
  action,
  orderId,
  totalAmount,
}: SubmitOrderParams) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User ID not found");

  const payload = {
    ...(orderId && { order_id: orderId }),
    ...(action && { action }), // <- ini tidak akan dikirim kalau undefined
    order: {
      order_type: customerType.toUpperCase(),
      payment_status: status,
      payment_method: paymentMethod || null,
      total_amount: totalAmount,
      created_by: userId,
      items: items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        note: item.note,
      })),
    },
  };

  return await ordersAPI.create(payload);
}
