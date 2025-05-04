import React from "react";
import { Product, OrderItem } from "@/lib/types";

interface PriceRangeAnalysisProps {
  products: Product[];
  orderItems: OrderItem[];
}

export default function PriceRangeAnalysis(
  { products, orderItems }: PriceRangeAnalysisProps = {
    products: [],
    orderItems: [],
  },
) {
  // Define price ranges
  const priceRanges = [
    { name: "< 10K", min: 0, max: 10000 },
    { name: "10K - 25K", min: 10000, max: 25000 },
    { name: "25K - 50K", min: 25000, max: 50000 },
    { name: "50K - 100K", min: 50000, max: 100000 },
    { name: "> 100K", min: 100000, max: Infinity },
  ];

  // Calculate sales by price range
  const calculatePriceRangeSales = () => {
    const rangeSales = priceRanges.map((range) => ({
      ...range,
      count: 0,
      revenue: 0,
      products: 0,
    }));

    // Count products in each range
    products.forEach((product) => {
      const rangeIndex = priceRanges.findIndex(
        (range) => product.price >= range.min && product.price < range.max,
      );
      if (rangeIndex >= 0) {
        rangeSales[rangeIndex].products += 1;
      }
    });

    // Count sales in each range
    orderItems.forEach((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        const rangeIndex = priceRanges.findIndex(
          (range) => product.price >= range.min && product.price < range.max,
        );
        if (rangeIndex >= 0) {
          rangeSales[rangeIndex].count += item.quantity;
          rangeSales[rangeIndex].revenue += item.price * item.quantity;
        }
      }
    });

    return rangeSales;
  };

  const priceRangeSales = calculatePriceRangeSales();
  const totalSales = priceRangeSales.reduce(
    (sum, range) => sum + range.count,
    0,
  );

  // Find best performing price range
  const bestPerformingRange = [...priceRangeSales].sort(
    (a, b) => b.count - a.count,
  )[0];

  return (
    <div className="space-y-6">
      {bestPerformingRange && bestPerformingRange.count > 0 && (
        <div className="bg-muted/30 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Best Performing Price Range
          </p>
          <p className="text-xl font-bold">{bestPerformingRange.name}</p>
          <p className="text-sm">
            {bestPerformingRange.count} items sold (
            {((bestPerformingRange.count / totalSales) * 100).toFixed(1)}% of
            total)
          </p>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-medium">Sales by Price Range</h3>
        <div className="space-y-2">
          {priceRangeSales.map((range) => {
            const percentage =
              totalSales > 0 ? (range.count / totalSales) * 100 : 0;

            return (
              <div key={range.name} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{range.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({range.products} products)
                    </span>
                  </div>
                  <span className="text-sm">
                    {range.count} sold ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
