"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, PieChart, LineChart, BarChart, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import PriceRangeAnalysis from "@/components/product-report/PriceRangeAnalysis";
import { productsAPI, ordersAPI } from "@/lib/api";
import { Product, Order, OrderItem } from "@/lib/types";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import { addDays, isAfter, isBefore } from "date-fns";
import { DateRange } from "react-day-picker";
import { SalesRangeResponse } from "@/lib/api";
export default function PriceRangeAnalysisPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [salesRange, setSalesRange] = useState<SalesRangeResponse | null>(null);
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // Report types for navigation
  const reportTypes = [
    {
      name: "Sales Transactions",
      path: "/reports",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: "Popular Products",
      path: "/reports/popular-products",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      name: "Category Breakdown",
      path: "/reports/category-breakdown",
      icon: <PieChart className="h-5 w-5" />,
    },
    {
      name: "Price Range Analysis",
      path: "/reports/price-range-analysis",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Time-Based Analysis",
      path: "/reports/time-based-analysis",
      icon: <LineChart className="h-5 w-5" />,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Ambil data sales range berdasarkan filter tanggal
        const response = await ordersAPI.getSalesRangeReport({
          start_date: date?.from?.toISOString(),
          end_date: date?.to?.toISOString(),
        });

        const ordersResponse = await ordersAPI.getAll("paid");

        // Filter orders berdasarkan created_at
        const filteredOrders = ordersResponse.data.filter((order) => {
          if (!date?.from || !date?.to) return true;
          const orderDate = new Date(order.created_at);
          return orderDate >= date.from && orderDate <= date.to;
        });

        setOrders(filteredOrders);

        // Fetch detail dari setiap order
        const orderDetailsPromises = filteredOrders.map((order) => ordersAPI.getById(order.id.toString()));

        const orderDetailsResults = await Promise.allSettled(orderDetailsPromises);

        const allOrderItems: OrderItem[] = [];
        orderDetailsResults.forEach((result) => {
          if (result.status === "fulfilled") {
            const detail = result.value as any;
            if (detail.items) {
              allOrderItems.push(...detail.items);
            }
          }
        });

        setOrderItems(allOrderItems);
        setSalesRange(response); // update sales range
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sales range report:", err);
        setError("Failed to load sales range report. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [date]); // Penting: gunakan date sebagai dependency

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => router.push("/reports")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold">Price Range Analysis Report</h1>
            </div>
            <div>
              <DatePickerWithRange value={date} setValue={setDate} />
            </div>
          </div>
        </header>

        {/* Report Types Navigation */}
        <div className="p-6 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {reportTypes.map((report) => (
              <Card key={report.path} className={`cursor-pointer hover:bg-muted/50 transition-colors ${report.path === "/reports/price-range-analysis" ? "bg-primary/10" : ""}`} onClick={() => router.push(report.path)}>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">{report.icon}</div>
                  <h3 className="font-medium text-center">{report.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 pt-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading report data...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Price Range Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <PriceRangeAnalysis products={products} salesRange={salesRange} />
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
