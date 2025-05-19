import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SalesFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  filterType: "daily" | "monthly" | "yearly";
  onFilterTypeChange: (value: "daily" | "monthly" | "yearly") => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export default function SalesFilters({
  statusFilter,
  onStatusFilterChange,
  filterType,
  onFilterTypeChange,
  onExportExcel,
  onExportPDF,
}: SalesFiltersProps) {
  return (
    <div className="flex items-center space-x-4">
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status Pembayaran" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="unpaid">Unpaid</SelectItem>
          <SelectItem value="canceled">Canceled</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filterType} onValueChange={onFilterTypeChange}>
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
            <Download className="h-4 w-4" />
            Export
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2">
          <div className="space-y-2">
            <div
              onClick={onExportExcel}
              className="cursor-pointer text-sm hover:bg-muted p-2 rounded"
            >
              Export to Excel
            </div>
            <div
              onClick={onExportPDF}
              className="cursor-pointer text-sm hover:bg-muted p-2 rounded"
            >
              Export to PDF
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}