import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, calculateSubtotal, calculateTax } from "@/lib/utils";

interface OrderDetail {
  order_number: string;
  created_at: string;
  payment_method: string;
  items: Array<{
    quantity: number;
    product_name: string;
    price: number;
    note?: string;
  }>;
}

interface ReceiptPreviewProps {
  orderDetail: OrderDetail;
}

export default function ReceiptPreview({ orderDetail }: ReceiptPreviewProps) {
  const subtotal = calculateSubtotal(orderDetail.items.map(item => ({
    price: item.price,
    quantity: item.quantity,
    discount: 0
  })));
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  return (
    <Card className="mt-6 print:block hidden" id="receipt-section">
      <CardContent className="pt-4">
        <div className="text-center mb-4">
          <h3 className="font-bold text-xl">Warung Makan</h3>
          <p className="text-sm text-muted-foreground">
            Jl. Contoh No. 123, Jakarta
          </p>
          <p className="text-sm text-muted-foreground">Tel: 021-1234567</p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(orderDetail.created_at).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Order #: {orderDetail.order_number}
          </p>
        </div>

        <Separator className="my-2" />

        <div className="space-y-2 mb-4">
          {orderDetail.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <div>
                <span>
                  {item.quantity}x {item.product_name}
                </span>
                {item.note && (
                  <span className="text-xs italic ml-1">({item.note})</span>
                )}
              </div>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <Separator className="my-2" />

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between font-bold mt-2">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="text-center mt-4 text-xs text-muted-foreground">
          <p>Payment Method: {orderDetail.payment_method.toUpperCase()}</p>
          <p className="mt-2">Thank you for your purchase!</p>
          <p>Please come again</p>
        </div>
      </CardContent>
    </Card>
  );
}