import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: number;
  order_number: string;
  created_at: string;
  payment_status: string;
  total_amount: number;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  onSelectTransaction: (id: number) => void;
  selectedTransactionId: number | null;
}

export function getBadgeVariant(status: string) {
  switch (status) {
    case "paid":
      return "default";
    case "unpaid":
      return "secondary";
    case "canceled":
      return "destructive";
    default:
      return "outline";
  }
}

export default function TransactionsTable({
  transactions,
  onSelectTransaction,
  selectedTransactionId,
}: TransactionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <TableRow
              key={tx.id}
              onClick={() => onSelectTransaction(tx.id)}
              className={`cursor-pointer ${
                selectedTransactionId === tx.id ? "bg-primary/10" : "hover:bg-muted/50"
              }`}
            >
              <TableCell>{tx.order_number}</TableCell>
              <TableCell>
                {format(new Date(tx.created_at), "yyyy-MM-dd HH:mm")}
              </TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(tx.payment_status)}>
                  {tx.payment_status.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                Rp {tx.total_amount.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <ChevronRight className="h-4 w-4" />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground"
            >
              No data found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}