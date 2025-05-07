"use client";

import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ordersAPI } from "@/lib/api";
import { Order, OrderDetail } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  BarChart3,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  PieChart,
  LineChart,
  BarChart,
  DollarSign,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { isSameDay, isSameMonth, isSameYear, parseISO } from "date-fns";
import {
  calculateDiscount,
  calculateSubtotal,
  calculateTax,
  formatCurrency,
} from "@/components/pos/OrderSummary/utils/calculations";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function ReportsPage() {
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [filterType, setFilterType] = useState<"daily" | "monthly" | "yearly">(
    "daily",
  );
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [page, setPage] = useState(1);
  const [singleDate, setSingleDate] = useState<Date | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [multipleDates, setMultipleDates] = useState<Date[]>([]);
  const [search, setSearch] = useState("");

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
    if (singleDate) {
      setDate(singleDate);
      setPage(1);
    }
  }, [filterType, date, singleDate, dateRange, multipleDates]);

  // Fetch orders list
  useEffect(() => {
    ordersAPI
      .getAllPaginated({ payment_status: "paid" })
      .then((data) => {
        if (Array.isArray(data.data)) setOrders(data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
      });
  }, [page]);

  // Fetch detail when invoice is selected
  useEffect(() => {
    if (selectedInvoice) {
      ordersAPI
        .getById(String(selectedInvoice))
        .then((data: unknown) => setOrderDetail(data as OrderDetail))
        .catch((err) => {
          console.error("Failed to fetch order detail:", err);
        });
    } else {
      setOrderDetail(null);
    }
  }, [selectedInvoice]);

  function getFilteredData() {
    return orders.filter((order) => {
      const orderDate = parseISO(order.created_at);
      const matchSearch = order.order_number
        .toLowerCase()
        .includes(search.toLowerCase());

      if (filterType === "yearly") {
        return matchSearch && isSameYear(orderDate, date);
      } else if (filterType === "monthly") {
        return matchSearch && isSameMonth(orderDate, date);
      } else {
        return matchSearch && isSameDay(orderDate, date);
      }
    });
  }

  const filteredData = getFilteredData();
  const paginatedData = filteredData.slice((page - 1) * 10, page * 10);
  const totalSales = filteredData.reduce(
    (sum, order) => sum + order.total_amount,
    0,
  );
  const totalPages = Math.ceil(filteredData.length / 10);
  const totalItems =
    orderDetail?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(date);
    if (filterType === "daily") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (filterType === "monthly") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    } else {
      newDate.setFullYear(
        newDate.getFullYear() + (direction === "next" ? 1 : -1),
      );
    }
    setDate(newDate);
  };

  const getDateDisplay = () => {
    if (filterType === "daily") return format(date, "EEEE, dd MMMM yyyy");
    if (filterType === "monthly") return format(date, "MMMM yyyy");
    return format(date, "yyyy");
  };

  type FilterType = "date" | "range" | "multi";
  type CalendarMode = "single" | "multiple" | "range";

  const modeMapping: Record<FilterType, CalendarMode> = {
    date: "single",
    range: "range",
    multi: "multiple",
  };

  const calendarTypeMapping: Record<
    "daily" | "monthly" | "yearly",
    FilterType
  > = {
    daily: "date",
    monthly: "range",
    yearly: "multi",
  };
  const calendarMode = modeMapping[calendarTypeMapping[filterType]];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Reports Dashboard</h1>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {/* Report Types Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {reportTypes.map((report) => (
              <Card
                key={report.path}
                className={`cursor-pointer hover:bg-muted/50 transition-colors ${report.path === "/reports" ? "bg-primary/10" : ""}`}
                onClick={() => router.push(report.path)}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    {report.icon}
                  </div>
                  <h3 className="font-medium text-center">{report.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sales Report Content */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Sales Transactions</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Select
                  value={filterType}
                  onValueChange={(val) => setFilterType(val as any)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {getDateDisplay()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    {calendarMode === "range" && (
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(date) => setDateRange(date as DateRange)}
                        required
                      />
                    )}

                    {calendarMode === "multiple" && (
                      <Calendar
                        mode="multiple"
                        selected={multipleDates}
                        onSelect={(date) => setMultipleDates(date as Date[])}
                      />
                    )}

                    {calendarMode === "single" && (
                      <Calendar
                        mode="single"
                        selected={singleDate}
                        onSelect={(date) => setSingleDate(date as Date)}
                      />
                    )}
                  </PopoverContent>
                </Popover>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateDate("prev")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateDate("next")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rp {totalSales.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    For {getDateDisplay()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {filteredData.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    For {getDateDisplay()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Items Sold
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalItems}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    For Selected Invoice
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sales Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Invoice #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {paginatedData.map((tx) => (
                        <tr
                          key={tx.id}
                          onClick={() => setSelectedInvoice(tx.id)}
                          className={`cursor-pointer ${selectedInvoice === tx.id ? "bg-primary/10" : "hover:bg-muted/50"}`}
                        >
                          <td className="px-4 py-3 text-sm">
                            {tx.order_number}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {format(
                              new Date(tx.created_at),
                              "yyyy-MM-dd HH:mm",
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {tx.payment_method}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            Rp {tx.total_amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <ChevronRight className="h-4 w-4" />
                          </td>
                        </tr>
                      ))}
                      {filteredData.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-muted-foreground"
                          >
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
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages || 1}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(filteredData.length / 10)}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
            {orderDetail && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Order Number
                      </h4>
                      <p>{orderDetail.order_number}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Payment Method
                      </h4>
                      <p>{orderDetail.payment_method}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Status
                      </h4>
                      <p>{orderDetail.payment_status}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Total
                      </h4>
                      <p>Rp {orderDetail.total_amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-xs font-medium">
                            Item
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium">
                            Qty
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium">
                            Price
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium">
                            Subtotal
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium">
                            Note
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetail.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2 text-sm">
                              {item.product_name}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              Rp {item.price.toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              Rp {(item.price * item.quantity).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-sm italic">
                              {item.note || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
            {orderDetail && (
              <>
                <div className="flex justify-end mt-4 print:hidden">
                  <Button onClick={() => window.print()}>Print Receipt</Button>
                </div>

                <Card className="mt-6 print:block hidden" id="receipt-section">
                  <CardContent className="pt-4">
                    <div className="text-center mb-4">
                      <h3 className="font-bold text-xl">Warung Makan</h3>
                      <p className="text-sm text-muted-foreground">
                        Jl. Contoh No. 123, Jakarta
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tel: 021-1234567
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(orderDetail.created_at).toLocaleString()}
                      </p>
                    </div>

                    <Separator className="my-2" />

                    <div className="space-y-2 mb-4">
                      {orderDetail.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <div>
                            <span>
                              {item.quantity}x {item.product_name}
                            </span>
                            {item.note && (
                              <span className="text-xs italic ml-1">
                                ({item.note})
                              </span>
                            )}
                          </div>
                          <span>
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-2" />

                    {(() => {
                      const subtotal = calculateSubtotal(orderDetail.items);
                      const tax = calculateTax(subtotal);
                      const total = subtotal + tax;

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
                            <p>
                              Payment Method:{" "}
                              {orderDetail.payment_method.toUpperCase()}
                            </p>
                            <p className="mt-2">Thank you for your purchase!</p>
                            <p>Please come again</p>
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
