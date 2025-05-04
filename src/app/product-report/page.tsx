"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, Calendar, Filter, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import { format, isWithinInterval, parseISO } from "date-fns";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { productsAPI, ordersAPI } from "@/lib/api";
import { Product, Order, OrderItem } from "@/lib/types";
import PopularProducts from "@/components/product-report/PopularProducts";
import CategoryBreakdown from "@/components/product-report/CategoryBreakdown";
import TimeBasedAnalysis from "@/components/product-report/TimeBasedAnalysis";
import PriceRangeAnalysis from "@/components/product-report/PriceRangeAnalysis";
import { OrderDetail } from "@/lib/types";

export default function ProductReportPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [filteredOrderItems, setFilteredOrderItems] = useState<OrderItem[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isDateFilterActive, setIsDateFilterActive] = useState<boolean>(false);

  // Filter data based on date range
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setIsDateFilterActive(true);

      // Filter orders by date range
      const filtered = orders.filter((order) => {
        const orderDate = parseISO(order.created_at);
        return (
          dateRange.from &&
          dateRange.to &&
          isWithinInterval(orderDate, {
            start: dateRange.from,
            end: dateRange.to,
          })
        );
      });
      setFilteredOrders(filtered);

      // Filter order items that belong to filtered orders
      const orderIds = new Set(filtered.map((order) => order.id));
      const filteredItems = orderItems.filter((item) => {
        // Find the order this item belongs to and check if it's in our filtered orders
        const orderProduct = products.find((p) => p.id === item.product_id);
        return orderIds.has(item.id); // This assumes item.id is the order id, adjust if needed
      });
      setFilteredOrderItems(filteredItems);
    } else {
      setIsDateFilterActive(false);
      setFilteredOrders(orders);
      setFilteredOrderItems(orderItems);
    }
  }, [dateRange, orders, orderItems, products]);

  const [favoritesData, setFavoritesData] = useState<any>(null);

  // Fetch data when date range changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productsData = await productsAPI.getAll();
        setProducts(
          productsData.map((p) => ({
            ...p,
            isPackage: p.is_package ?? false,
          }))
        );
        
        // Fetch orders
        const ordersResponse = await ordersAPI.getAll("paid");
        setOrders(ordersResponse.data);

        // Fetch favorites data for popular products and category breakdown
        const params: {
          category?: string;
          start_date?: string;
          end_date?: string;
        } = {};
        if (dateRange?.from) {
          params.start_date = format(dateRange.from, "yyyy-MM-dd");
        }
        if (dateRange?.to) {
          params.end_date = format(dateRange.to, "yyyy-MM-dd");
        }

        try {
          const favorites = await ordersAPI.getFavorites(params);
          setFavoritesData(favorites);
        } catch (favError) {
          console.error("Error fetching favorites:", favError);
        }

        // For each order, fetch order details to get items
        const orderDetailsPromises = ordersResponse.data.map((order) =>
          ordersAPI.getById(order.id.toString()),
        );

        const orderDetailsResults =
          await Promise.allSettled(orderDetailsPromises);

        // Extract order items from successful responses
        const allOrderItems: OrderItem[] = [];
        orderDetailsResults.forEach((result) => {
          if (result.status === "fulfilled") {
            const detail = result.value as OrderDetail;
            if (detail.items) {
              allOrderItems.push(...detail.items);
            }
          }
        });

        setOrderItems(allOrderItems);
        setFilteredOrderItems(allOrderItems);
        setFilteredOrders(ordersResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load report data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <div className="flex h-screen bg-background">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Product Report</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={isDateFilterActive ? "default" : "outline"}
                    size="sm"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {isDateFilterActive ? (
                      <span>
                        {dateRange?.from ? format(dateRange.from, "PPP") : ""} -{" "}
                        {dateRange?.to ? format(dateRange.to, "PPP") : ""}
                      </span>
                    ) : (
                      <span>Filter by Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <DatePickerWithRange
                    date={dateRange}
                    setDate={setDateRange}
                  />
                </PopoverContent>
              </Popover>
              {isDateFilterActive && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDateRange(undefined)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading report data...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <PopularProducts
                    products={products}
                    orderItems={
                      isDateFilterActive ? filteredOrderItems : orderItems
                    }
                    favoritesData={favoritesData}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryBreakdown
                    products={products}
                    orderItems={
                      isDateFilterActive ? filteredOrderItems : orderItems
                    }
                    favoritesData={favoritesData}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time-Based Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <TimeBasedAnalysis
                    orders={isDateFilterActive ? filteredOrders : orders}
                    orderItems={
                      isDateFilterActive ? filteredOrderItems : orderItems
                    }
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Price Range Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <PriceRangeAnalysis
                    products={products}
                    orderItems={
                      isDateFilterActive ? filteredOrderItems : orderItems
                    }
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
