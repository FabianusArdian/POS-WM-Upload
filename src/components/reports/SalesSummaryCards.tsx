import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesSummaryCardsProps {
  totalSales: number;
  transactionCount: number;
  totalItems: number;
  dateDisplay: string;
}

export default function SalesSummaryCards({
  totalSales,
  transactionCount,
  totalItems,
  dateDisplay,
}: SalesSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            Rp {totalSales.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            For {dateDisplay}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{transactionCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            For {dateDisplay}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Items Sold</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
          <p className="text-xs text-muted-foreground mt-1">
            For Selected Invoice
          </p>
        </CardContent>
      </Card>
    </div>
  );
}