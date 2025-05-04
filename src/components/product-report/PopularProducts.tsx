import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product, OrderItem } from "@/lib/types";

interface PopularProductsProps {
  products: Product[];
  orderItems: OrderItem[];
  favoritesData?: any;
}

interface PopularProduct {
  id: number;
  name: string;
  category: string;
  soldCount: number;
}

export default function PopularProducts(
  { products, orderItems, favoritesData }: PopularProductsProps = {
    products: [],
    orderItems: [],
    favoritesData: null,
  },
) {
  // Calculate product popularity based on order frequency
  const calculatePopularity = () => {
    // If we have favorites data from the API, use that
    if (favoritesData && Array.isArray(favoritesData.popular_products)) {
      return favoritesData.popular_products.map((item: any) => ({
        id: item.product_id,
        name: item.product_name,
        category: item.category || "",
        soldCount: item.quantity || 0,
      }));
    }

    // Otherwise, fall back to the original calculation
    const productCounts = new Map<number, number>();

    // Count occurrences of each product in order items
    orderItems.forEach((item) => {
      const currentCount = productCounts.get(item.product_id) || 0;
      productCounts.set(item.product_id, currentCount + item.quantity);
    });

    // Convert to array for sorting
    const productPopularity = products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      soldCount: productCounts.get(product.id) || 0,
    }));

    // Sort by sold count (descending)
    return productPopularity.sort((a, b) => b.soldCount - a.soldCount);
  };

  const popularProducts = calculatePopularity();
  const mostPopular = popularProducts.slice(0, 5); // Top 5
  const leastPopular = [...popularProducts]
    .sort((a, b) => a.soldCount - b.soldCount)
    .slice(0, 5); // Bottom 5

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Most Popular Products</h3>
        <div className="space-y-2">
          {mostPopular.length > 0 ? (
            mostPopular.map((product: PopularProduct) => (
              <div
                key={product.id}
                className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
              >
                <span className="font-medium">{product.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {product.category}
                  </span>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                    {product.soldCount} sold
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground text-sm">
              No data available
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Least Popular Products</h3>
        <div className="space-y-2">
          {leastPopular.length > 0 ? (
            leastPopular.map((product: PopularProduct) => (
              <div
                key={product.id}
                className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
              >
                <span className="font-medium">{product.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {product.category}
                  </span>
                  <span className="bg-destructive/10 text-destructive px-2 py-1 rounded-md text-sm">
                    {product.soldCount} sold
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground text-sm">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
