import React, { useState, useEffect } from "react";
import { Product, OrderItem } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryBreakdownProps {
  products: Product[];
  orderItems: OrderItem[];
  favoritesData?: any;
}

interface ProductSalesData {
  product_name: string;
  category: string;
  total_sales: number;
}

export default function CategoryBreakdown(
  { products, orderItems, favoritesData }: CategoryBreakdownProps = {
    products: [],
    orderItems: [],
    favoritesData: null,
  },
) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [productSalesData, setProductSalesData] = useState<ProductSalesData[]>(
    [],
  );
  const [filteredProductSalesData, setFilteredProductSalesData] = useState<
    ProductSalesData[]
  >([]);

  // Extract unique categories from products
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category)),
    );
    setCategories(uniqueCategories);
  }, [products]);

  // Calculate sales data for each product
  useEffect(() => {
    // If we have favorites data from the API, use that
    if (favoritesData && Array.isArray(favoritesData.popular_products)) {
      const apiData = favoritesData.popular_products.map((item: any) => ({
        product_name: item.product_name,
        category: item.category || "",
        total_sales: item.quantity || 0,
      }));
      setProductSalesData(apiData);
      return;
    }

    // Otherwise, fall back to the original calculation
    const salesByProduct = new Map<string, number>();

    // Count sales for each product
    orderItems.forEach((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) return;

      const productId = item.product_id;
      const currentCount = salesByProduct.get(productId.toString()) || 0;
      salesByProduct.set(productId.toString(), currentCount + item.quantity);
    });

    // Create product sales data array
    const productSales: ProductSalesData[] = products.map((product) => ({
      product_name: product.name,
      category: product.category,
      total_sales: salesByProduct.get(product.id.toString()) || 0,
    }));

    // Sort by total sales in descending order
    productSales.sort((a, b) => b.total_sales - a.total_sales);

    setProductSalesData(productSales);
  }, [products, orderItems, favoritesData]);

  // Filter products by selected category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProductSalesData(productSalesData);
    } else {
      setFilteredProductSalesData(
        productSalesData.filter((item) => item.category === selectedCategory),
      );
    }
  }, [selectedCategory, productSalesData]);

  // Handle category selection change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  // Calculate totals
  const totalSales = filteredProductSalesData.reduce(
    (sum, item) => sum + item.total_sales,
    0,
  );

  const categorySales = categories.map((category) => {
    const categoryItems = productSalesData.filter(
      (item) => item.category === category,
    );
    const count = categoryItems.reduce(
      (sum, item) => sum + item.total_sales,
      0,
    );
    return { category, count };
  });

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="bg-muted/30 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Total Items Sold</p>
          <p className="text-2xl font-bold">{totalSales}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Product Sales Breakdown</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground">
            <div className="col-span-6">Product</div>
            <div className="col-span-3">Category</div>
            <div className="col-span-3 text-right">Total Sales</div>
          </div>
          {filteredProductSalesData.length > 0 ? (
            filteredProductSalesData.map((item) => (
              <div
                key={item.product_name}
                className="grid grid-cols-12 py-2 border-b"
              >
                <div className="col-span-6 font-medium">
                  {item.product_name}
                </div>
                <div className="col-span-3 text-muted-foreground">
                  {item.category}
                </div>
                <div className="col-span-3 text-right">{item.total_sales}</div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mt-6">
        <h3 className="font-medium">Category Summary</h3>
        {categorySales
          .sort((a, b) => b.count - a.count)
          .map((item) => {
            const percentage =
              totalSales > 0 ? (item.count / totalSales) * 100 : 0;

            return (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-sm">
                    {item.count} items ({percentage.toFixed(1)}%)
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
  );
}
