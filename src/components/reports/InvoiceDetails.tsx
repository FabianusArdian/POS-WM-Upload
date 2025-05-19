import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderDetail {
  order_number: string;
  payment_method: string;
  payment_status: string;
  total_amount: number;
  items: Array<{
    id: number;
    product_name: string;
    quantity: number;
    price: number;
    note?: string;
  }>;
}

interface InvoiceDetailsProps {
  orderDetail: OrderDetail;
  onPrintReceipt: () => void;
}

export default function InvoiceDetails({
  orderDetail,
  onPrintReceipt,
}: InvoiceDetailsProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Invoice Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Order Number
            </h4>
            <p>{orderDetail.order_number}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Payment Method
            </h4>
            <p>{orderDetail.payment_method}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Status
            </h4>
            <p>{orderDetail.payment_status}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Total
            </h4>
            <p>Rp {orderDetail.total_amount.toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderDetail.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    Rp {item.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    Rp {(item.price * item.quantity).toLocaleString()}
                  </TableCell>
                  <TableCell className="italic">
                    {item.note || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onPrintReceipt}>Print Receipt</Button>
        </div>
      </CardContent>
    </Card>
  );
}