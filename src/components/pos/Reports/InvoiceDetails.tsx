"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { calculateSubtotal, calculateTax, formatCurrency } from "@/components/pos/OrderSummary/utils/calculations"
import type { OrderDetail } from "@/lib/types"

interface InvoiceDetailsProps {
  orderDetail: OrderDetail | null
  printReceipt: () => void
}

export default function InvoiceDetails({ orderDetail, printReceipt }: InvoiceDetailsProps) {
  if (!orderDetail) return null

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Order Number</h4>
              <p>{orderDetail.order_number}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Payment Method</h4>
              <p>{orderDetail.payment_method}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <p>{orderDetail.payment_status}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Total</h4>
              <p>Rp {orderDetail.total_amount.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2 text-left text-xs font-medium">Item</th>
                  <th className="px-4 py-2 text-left text-xs font-medium">Qty</th>
                  <th className="px-4 py-2 text-left text-xs font-medium">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium">Subtotal</th>
                  <th className="px-4 py-2 text-left text-xs font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {orderDetail.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 text-sm">{item.product_name}</td>
                    <td className="px-4 py-2 text-sm">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm">Rp {item.price.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">Rp {(item.price * item.quantity).toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm italic">{item.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-4 print:hidden">
        <Button onClick={printReceipt}>Print Receipt</Button>
      </div>

      <Card className="mt-6 print:block hidden" id="receipt-section">
        <CardContent className="pt-4">
          <div className="text-center mb-4">
            <h3 className="font-bold text-xl">Warung Makan</h3>
            <p className="text-sm text-muted-foreground">Jl. Contoh No. 123, Jakarta</p>
            <p className="text-sm text-muted-foreground">Tel: 021-1234567</p>
            <p className="text-xs text-muted-foreground mt-1">{new Date(orderDetail.created_at).toLocaleString()}</p>
          </div>

          <Separator className="my-2" />

          <div className="space-y-2 mb-4">
            {orderDetail.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <span>
                    {item.quantity}x {item.product_name}
                  </span>
                  {item.note && <span className="text-xs italic ml-1">({item.note})</span>}
                </div>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <Separator className="my-2" />

          {(() => {
            const subtotal = calculateSubtotal(orderDetail.items)
            const tax = calculateTax(subtotal)
            const total = subtotal + tax

            return (
              <>
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
              </>
            )
          })()}
        </CardContent>
      </Card>
    </>
  )
}
