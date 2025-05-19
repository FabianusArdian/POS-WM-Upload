"use client"

import { format } from "date-fns"
import { ChevronRight } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types"

interface TransactionsTableProps {
  paginatedData: Order[]
  selectedInvoice: number | null
  setSelectedInvoice: (id: number) => void
  page: number
  setPage: (page: number) => void
  totalPages: number
  filteredData: Order[]
}

function getBadgeVariant(status: string) {
  switch (status) {
    case "paid":
      return "default"
    case "unpaid":
      return "secondary"
    case "canceled":
      return "destructive"
    default:
      return "outline"
  }
}

export default function TransactionsTable({
  paginatedData,
  selectedInvoice,
  setSelectedInvoice,
  page,
  setPage,
  totalPages,
  filteredData,
}: TransactionsTableProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sales Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Invoice #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {paginatedData.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedInvoice(tx.id)}
                    className={`cursor-pointer ${selectedInvoice === tx.id ? "bg-primary/10" : "hover:bg-muted/50"}`}
                  >
                    <td className="px-4 py-3 text-sm">{tx.order_number}</td>
                    <td className="px-4 py-3 text-sm">{format(new Date(tx.created_at), "yyyy-MM-dd HH:mm")}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={getBadgeVariant(tx.payment_status)}>{tx.payment_status.toUpperCase()}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">Rp {tx.total_amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <ChevronRight className="h-4 w-4" />
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between mt-4">
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages || 1}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= Math.ceil(filteredData.length / 10)}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </>
  )
}
