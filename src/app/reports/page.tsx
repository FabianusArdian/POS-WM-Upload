'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ordersAPI } from '@/lib/api'
import { Order, OrderDetail } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  BarChart3,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
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


export default function ReportsPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>(new Date())
  const [filterType, setFilterType] = useState<'daily' | 'monthly' | 'yearly'>('daily')
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null)
  const [page, setPage] = useState(1);
  
  // Fetch orders list
  useEffect(() => {
    const offset = (page - 1) * 20;
  
    ordersAPI
      .getAllPaginated({ status: "paid", limit: 10, offset })
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
      ordersAPI.getById(String(selectedInvoice))
        .then(setOrderDetail)
        .catch((err) => {
          console.error('Failed to fetch order detail:', err)
        })
    } else {
      setOrderDetail(null)
    }
  }, [selectedInvoice])

  const getFilteredData = () => {
    if (!orders.length) return []

    if (filterType === 'daily') {
      const formattedDate = format(date, 'yyyy-MM-dd')
      return orders.filter(order => order.created_at.startsWith(formattedDate))
    } else if (filterType === 'monthly') {
      const month = format(date, 'yyyy-MM')
      return orders.filter(order => order.created_at.startsWith(month))
    } else {
      const year = format(date, 'yyyy')
      return orders.filter(order => order.created_at.startsWith(year))
    }
  }

  const filteredData = getFilteredData()
  const totalSales = filteredData.reduce((sum, order) => sum + order.total_amount, 0)
  const totalItems = orderDetail?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(date)
    if (filterType === 'daily') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    } else if (filterType === 'monthly') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1))
    }
    setDate(newDate)
  }

  const getDateDisplay = () => {
    if (filterType === 'daily') return format(date, 'EEEE, dd MMMM yyyy')
    if (filterType === 'monthly') return format(date, 'MMMM yyyy')
    return format(date, 'yyyy')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">Food POS</h2>
          <p className="text-sm text-muted-foreground">Restaurant Management</p>
        </div>
        <nav className="space-y-2 flex-1">
          <Button variant="ghost" className="w-full justify-start" size="lg" onClick={() => router.push('/dashboard')}>
            <BarChart3 className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
          <Button variant="default" className="w-full justify-start" size="lg">
            <BarChart3 className="mr-2 h-5 w-5" />
            Reports
          </Button>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Sales Reports</h1>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select value={filterType} onValueChange={val => setFilterType(val as any)}>
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
                  <Button variant="outline" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {getDateDisplay()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode={filterType === 'yearly' ? 'year' : filterType === 'monthly' ? 'month' : 'day'}
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                  />
                </PopoverContent>
              </Popover>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
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
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Sales</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {totalSales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">For {getDateDisplay()}</p>
              </CardContent>
            </Card>

            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Transactions</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredData.length}</div>
                <p className="text-xs text-muted-foreground mt-1">For {getDateDisplay()}</p>
              </CardContent>
            </Card>

            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Items Sold</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalItems}</div>
                <p className="text-xs text-muted-foreground mt-1">For Selected Invoice</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Sales Transactions</CardTitle></CardHeader>
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
                    {filteredData.map((tx) => (
                      <tr key={tx.id} onClick={() => setSelectedInvoice(tx.id)} className={`cursor-pointer ${selectedInvoice === tx.id ? 'bg-primary/10' : 'hover:bg-muted/50'}`}>
                        <td className="px-4 py-3 text-sm">{tx.order_number}</td>
                        <td className="px-4 py-3 text-sm">{format(new Date(tx.created_at), 'yyyy-MM-dd HH:mm')}</td>
                        <td className="px-4 py-3 text-sm">{tx.payment_method}</td>
                        <td className="px-4 py-3 text-sm">Rp {tx.total_amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-right"><ChevronRight className="h-4 w-4" /></td>
                      </tr>
                    ))}
                    {filteredData.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No data found</td></tr>
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
    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
  >
    Previous
  </Button>
  <span className="text-sm text-muted-foreground">Page {page}</span>
  <Button
    variant="outline"
    size="sm"
    disabled={orders.length < 10} // asumsi full page = masih ada next
    onClick={() => setPage((prev) => prev + 1)}
  >
    Next
  </Button>
</div>
          {orderDetail && (
            <Card className="mt-6">
              <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div><h4 className="text-sm font-medium text-muted-foreground">Order Number</h4><p>{orderDetail.order_number}</p></div>
                  <div><h4 className="text-sm font-medium text-muted-foreground">Payment Method</h4><p>{orderDetail.payment_method}</p></div>
                  <div><h4 className="text-sm font-medium text-muted-foreground">Status</h4><p>{orderDetail.payment_status}</p></div>
                  <div><h4 className="text-sm font-medium text-muted-foreground">Total</h4><p>Rp {orderDetail.total_amount.toLocaleString()}</p></div>
                </div>

                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-2 text-left text-xs font-medium">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Subtotal</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetail.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm">{item.product_name}</td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm">Rp {item.price.toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm">Rp {(item.price * item.quantity).toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm italic">{item.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
