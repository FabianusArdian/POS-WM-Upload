"use client"

import { useEffect, useState } from "react"
import type { DateRange } from "react-day-picker"
import { format, isSameDay, isSameMonth, isSameYear, parseISO } from "date-fns"
import { ordersAPI } from "@/lib/api"
import type { Order, OrderDetail } from "@/lib/types"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import AdminSidebar from "@/components/layout/AdminSidebar"

// Import refactored components
import ReportHeader from "@/components/pos/Reports/ReportHeader"
import ReportSummaryCards from "@/components/pos/Reports/ReportSummaryCards"
import TransactionsTable from "@/components/pos/Reports/TransactionsTable"
import InvoiceDetails from "@/components/pos/Reports/InvoiceDetails"
import ReportNavigation from "@/components/pos/Reports/ReportNavigation"

export default function ReportsPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [filterType, setFilterType] = useState<"daily" | "monthly" | "yearly">("daily")
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null)
  const [page, setPage] = useState(1)
  const [singleDate, setSingleDate] = useState<Date | undefined>()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [multipleDates, setMultipleDates] = useState<Date[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid" | "canceled">("all")

  useEffect(() => {
    if (filterType === "daily" && singleDate) {
      setDate(singleDate)
    } else if (filterType === "monthly" && dateRange?.from) {
      setDate(dateRange.from)
    } else if (filterType === "yearly" && multipleDates.length > 0) {
      setDate(multipleDates[0])
    }
    setPage(1)
  }, [filterType, singleDate, dateRange, multipleDates])

  // Fetch orders list
  useEffect(() => {
    const statusParam = statusFilter !== "all" ? { payment_status: statusFilter } : {}
    ordersAPI
      .getAllPaginated(statusParam)
      .then((data) => {
        if (Array.isArray(data.data)) setOrders(data.data)
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err)
      })
  }, [page, statusFilter])

  const fetchFullOrdersWithItems = async () => {
    const filteredOrders = getFilteredData()
    const details: OrderDetail[] = []

    for (const order of filteredOrders) {
      try {
        const detail = await ordersAPI.getById(String(order.id))
        details.push(detail as OrderDetail)
      } catch (err) {
        console.error(`Failed to get detail for order ${order.id}`, err)
      }
    }

    return details
  }

  // Fetch detail when invoice is selected
  useEffect(() => {
    if (selectedInvoice) {
      ordersAPI
        .getById(String(selectedInvoice))
        .then((data: unknown) => setOrderDetail(data as OrderDetail))
        .catch((err) => {
          console.error("Failed to fetch order detail:", err)
        })
    } else {
      setOrderDetail(null)
    }
  }, [selectedInvoice])

  function getFilteredData() {
    return orders.filter((order) => {
      const orderDate = parseISO(order.created_at)
      const matchSearch = order.order_number.toLowerCase().includes(search.toLowerCase())

      const matchDate =
        filterType === "yearly"
          ? isSameYear(orderDate, date)
          : filterType === "monthly"
            ? isSameMonth(orderDate, date)
            : isSameDay(orderDate, date)

      const matchStatus = statusFilter === "all" ? true : order.payment_status === statusFilter

      return matchSearch && matchDate && matchStatus
    })
  }

  const filteredData = getFilteredData()
  const paginatedData = filteredData.slice((page - 1) * 10, page * 10)
  const totalSales = filteredData.reduce((sum, order) => sum + order.total_amount, 0)
  const totalPages = Math.ceil(filteredData.length / 10)
  const totalItems = orderDetail?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  const getDateDisplay = () => {
    if (filterType === "daily") return format(date, "EEEE, dd MMMM yyyy")
    if (filterType === "monthly") return format(date, "MMMM yyyy")
    return format(date, "yyyy")
  }

  // Export functions
  const handleExportExcel = async () => {
    const ordersWithItems = await fetchFullOrdersWithItems()
    const rows: any[] = []

    ordersWithItems.forEach((order) => {
      rows.push({
        "Order Number": order.order_number,
        Date: new Date(order.created_at).toLocaleString("id-ID"),
        Status: order.payment_status,
        Total: "",
        Product: "",
        Quantity: "",
        Price: "",
      })

      let subtotal = 0

      order.items.forEach((item) => {
        const itemTotal = item.price * item.quantity
        subtotal += itemTotal

        rows.push({
          "Order Number": "",
          Date: "",
          Status: "",
          Total: "",
          Product: item.product_name,
          Quantity: item.quantity,
          Price: item.price,
        })
      })

      const tax = subtotal * 0.1
      const total = subtotal + tax

      rows.push({
        Product: "Subtotal",
        Price: subtotal,
      })

      rows.push({
        Product: "Tax 10%",
        Price: tax,
      })

      rows.push({
        Product: "Total",
        Price: total,
      })

      rows.push({}) // empty row
    })

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Transactions")
    XLSX.writeFile(workbook, `sales_transactions_${Date.now()}.xlsx`)
  }

  const handleExportPDF = async () => {
    const ordersWithItems = await fetchFullOrdersWithItems()
    const doc = new jsPDF()
    let y = 15

    ordersWithItems.forEach((order, idx) => {
      doc.setFontSize(10)
      doc.text(
        `${idx + 1}. ${order.order_number} | ${new Date(order.created_at).toLocaleString("id-ID")} | ${order.payment_status}`,
        14,
        y,
      )
      y += 6

      let subtotal = 0

      const itemRows = order.items.map((item) => {
        const total = item.price * item.quantity
        subtotal += total

        return [item.product_name, item.quantity, `Rp ${item.price.toLocaleString("id-ID")}`]
      })

      const tax = subtotal * 0.1
      const total = subtotal + tax

      itemRows.push(["Subtotal", "", `Rp ${subtotal.toLocaleString("id-ID")}`])
      itemRows.push(["Tax 10%", "", `Rp ${tax.toLocaleString("id-ID")}`])
      itemRows.push(["Total", "", `Rp ${total.toLocaleString("id-ID")}`])

      autoTable(doc, {
        startY: y,
        head: [["Product", "Qty", "Price"]],
        body: itemRows,
        margin: { left: 14 },
      })

      y = (doc as any).lastAutoTable.finalY + 10
    })

    doc.save(`sales_transactions_${Date.now()}.pdf`)
  }

  // Print receipt function
  const printReceipt = () => {
    if (!orderDetail) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Please allow popups for this website")
      return
    }

    // Calculate values correctly - direct calculation
    const subtotal = orderDetail.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = 0 // If there's no discount in the system
    const tax = Math.round(subtotal * 0.1) // 10% tax
    const total = subtotal + tax

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${orderDetail.order_number}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 300px; margin: 0 auto; padding: 20px 0; }
            .receipt { padding: 10px; border: 1px solid #eee; border-radius: 5px; }
            .header, .footer { text-align: center; margin: 10px 0; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .item-name { max-width: 70%; }
            .item-price { text-align: right; }
            .total { font-weight: bold; margin-top: 10px; }
            .small { font-size: 12px; color: #666; }
            .summary-row { display: flex; justify-content: space-between; margin: 4px 0; }
            .summary-total { font-weight: bold; font-size: 16px; margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2 style="margin-bottom: 5px;">Warung Makan</h2>
              <p class="small" style="margin: 5px 0;">Jl. Contoh No. 123, Jakarta</p>
              <p class="small" style="margin: 5px 0;">Tel: 021-1234567</p>
              <p class="small" style="margin: 5px 0;">${new Date(orderDetail.created_at).toLocaleString()}</p>
              <p class="small" style="margin: 5px 0;">Order #: ${orderDetail.order_number}</p>
            </div>
            
            <div class="divider"></div>
            
            ${orderDetail.items
              .map(
                (item) => `
              <div class="item">
                <div class="item-name">${item.quantity}x ${item.product_name} ${item.note ? `<br><span style="font-size: 11px; font-style: italic;">(${item.note})</span>` : ""}</div>
                <div class="item-price">Rp ${(item.price * item.quantity).toLocaleString()}</div>
              </div>
            `,
              )
              .join("")}
            
            <div class="divider"></div>
            
            <div class="summary-row"><span>Subtotal</span><span>Rp ${subtotal.toLocaleString()}</span></div>
            ${discount > 0 ? `<div class="summary-row"><span>Discount</span><span>Rp ${discount.toLocaleString()}</span></div>` : ""}
            <div class="summary-row"><span>Tax (10%)</span><span>Rp ${tax.toLocaleString()}</span></div>
            <div class="summary-row summary-total"><span>Total</span><span>Rp ${total.toLocaleString()}</span></div>
            
            <div class="divider"></div>
            
            <div class="footer">
              <p style="margin: 5px 0;">Payment Method: ${orderDetail.payment_method.toUpperCase()}</p>
              <p style="margin: 10px 0 5px;">Thank you for your purchase!</p>
              <p style="margin: 5px 0;">Please come again</p>
            </div>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

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
          <ReportNavigation />

          {/* Sales Report Content */}
          <ReportHeader
            filterType={filterType}
            setFilterType={setFilterType}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            date={date}
            getDateDisplay={getDateDisplay}
            singleDate={singleDate}
            setSingleDate={setSingleDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            multipleDates={multipleDates}
            setMultipleDates={setMultipleDates}
            handleExportExcel={handleExportExcel}
            handleExportPDF={handleExportPDF}
          />

          <ReportSummaryCards
            totalSales={totalSales}
            filteredData={filteredData}
            getDateDisplay={getDateDisplay}
            totalItems={totalItems}
          />

          <TransactionsTable
            paginatedData={paginatedData}
            selectedInvoice={selectedInvoice}
            setSelectedInvoice={setSelectedInvoice}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            filteredData={filteredData}
          />

          <InvoiceDetails orderDetail={orderDetail} printReceipt={printReceipt} />
        </main>
      </div>
    </div>
  )
}
