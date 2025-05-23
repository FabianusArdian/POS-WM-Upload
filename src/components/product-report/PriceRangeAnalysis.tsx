import React from "react";
import { SalesRangeResponse } from "@/lib/api"; // sesuaikan import-nya
import { Product } from "@/lib/types";
interface PriceRangeAnalysisProps {
  salesRange: SalesRangeResponse | null;
  products: Product[];
}

export default function PriceRangeAnalysis({ salesRange }: PriceRangeAnalysisProps) {
  if (!salesRange) {
    return <p>No data available.</p>;
  }

  const totalSales = salesRange.total_sold;
  const bestRange = salesRange.best_range;

  return (
    <div className="space-y-6">
      {/* Best performing range */}
      {bestRange && (
        <div className="bg-muted/30 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Best Performing Price Range</p>
          <p className="text-xl font-bold">{bestRange}</p>
          {/* Cari range details untuk bestRange */}
          {salesRange.ranges.map((range) =>
            range.range === bestRange ? (
              <p key={range.range} className="text-sm">
                {range.items_sold} items sold ({range.percentage.toFixed(1)}% of total)
              </p>
            ) : null
          )}
        </div>
      )}

      {/* Sales by price range */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Sales by Price Range</h3>
        <div className="space-y-2">
          {salesRange.ranges.map((range) => {
            const percentage = range.percentage; // sudah dalam persen

            return (
              <div key={range.range} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{range.range}</span>
                    <span className="text-xs text-muted-foreground ml-2">({range.products.length} products)</span>
                  </div>
                  <span className="text-sm">
                    {range.items_sold} sold ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
