"use client"
import { useRouter } from "next/navigation"
import { CalendarIcon, Download } from "lucide-react"
import ReactCalendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { DateRange } from "react-day-picker"
import DatePickerByMode from "@/components/ui/date-picker-by-mode"

interface ReportHeaderProps {
  filterType: "daily" | "monthly" | "yearly"
  setFilterType: (type: "daily" | "monthly" | "yearly") => void
  statusFilter: "all" | "paid" | "unpaid" | "canceled"
  setStatusFilter: (status: "all" | "paid" | "unpaid" | "canceled") => void
  date: Date
  getDateDisplay: () => string
  singleDate: Date | undefined
  setSingleDate: (date: Date) => void
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange) => void
  multipleDates: Date[]
  setMultipleDates: (dates: Date[]) => void
  handleExportExcel: () => Promise<void>
  handleExportPDF: () => Promise<void>
}

export default function ReportHeader({
  filterType,
  setFilterType,
  statusFilter,
  setStatusFilter,
  date,
  getDateDisplay,
  singleDate,
  setSingleDate,
  dateRange,
  setDateRange,
  multipleDates,
  setMultipleDates,
  handleExportExcel,
  handleExportPDF,
}: ReportHeaderProps) {
  const router = useRouter()

  type FilterType = "date" | "range" | "multi"
  type CalendarMode = "single" | "multiple" | "range"

  const modeMapping: Record<FilterType, CalendarMode> = {
    date: "single",
    range: "range",
    multi: "multiple",
  }

  const calendarTypeMapping: Record<"daily" | "monthly" | "yearly", FilterType> = {
    daily: "date",
    monthly: "range",
    yearly: "multi",
  }

  const calendarMode = modeMapping[calendarTypeMapping[filterType]]

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Sales Transactions</h2>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
            <div>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status Pembayaran" />
              </SelectTrigger>
            </div>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={(val) => setFilterType(val as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerByMode
            value={
              filterType === "daily"
                ? singleDate
                : filterType === "monthly"
                ? dateRange?.from ? [dateRange.from] : []
                : multipleDates
            }
            setValue={(val) => {
              if (filterType === "daily") setSingleDate(val)
              else if (filterType === "monthly") setDateRange({ from: val[0], to: val[0] })
              else if (filterType === "yearly") setMultipleDates(val)
            }}
            filterType={filterType}
          />

          <Popover>
            <PopoverTrigger asChild>
              <div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2">
              <div className="space-y-2">
                <div onClick={handleExportExcel} className="cursor-pointer text-sm hover:bg-muted p-2 rounded">
                  Export to Excel
                </div>
                <div onClick={handleExportPDF} className="cursor-pointer text-sm hover:bg-muted p-2 rounded">
                  Export to PDF
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
