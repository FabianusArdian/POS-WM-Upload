"use client"

import React, { useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

type FilterType = "daily" | "monthly" | "yearly"

type Props = {
  filterType: FilterType
  value: Date | Date[] | [Date, Date] | undefined
  setValue: (value: any) => void
}

export default function DatePickerByMode({ filterType, value, setValue }: Props) {
  const [open, setOpen] = useState(false)

  const getDisplay = () => {
  if (!value) return "Pilih tanggal"

  if (filterType === "daily" && value instanceof Date) {
    return format(value, "PPP")
  }

  if (
    filterType === "monthly" &&
    Array.isArray(value) &&
    value[0] instanceof Date
  ) {
    return format(value[0], "MMMM yyyy")
  }

  if (
    filterType === "yearly" &&
    Array.isArray(value) &&
    value.length > 0 &&
    value[0] instanceof Date
  ) {
    return value.map((v: Date) => format(v, "yyyy")).join(", ")
  }

  return "Pilih tanggal"
}

  const getView = () => {
    if (filterType === "monthly") return "year"
    if (filterType === "yearly") return "decade"
    return "month"
  }

  const getTileDisabled = () => {
    if (filterType === "yearly") {
      return ({ view }: { view: string }) => view !== "decade"
    }
    if (filterType === "monthly") {
      return ({ view }: { view: string }) => view !== "year"
    }
    return () => false
  }

  const handleChange = (val: any) => {
  if (filterType === "daily") {
    setValue(val)
    setOpen(false)
  } else if (filterType === "monthly") {
    setValue([val])
    setOpen(false)
  } else if (filterType === "yearly") {
    setValue([val])
    setOpen(false)
  }
}

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getDisplay()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white rounded-md shadow-md">
          <Calendar
            selectRange={false}
            view={getView()}
            tileDisabled={getTileDisabled()}
            onClickMonth={(val) => {
                if (filterType === "monthly") handleChange(val)
            }}
            onClickYear={(val) => {
                if (filterType === "yearly") handleChange(val)
            }}
            onClickDay={(val) => {
                if (filterType === "daily") handleChange(val)
            }}
            onActiveStartDateChange={({ activeStartDate }) => {
                // Memastikan UI update tampilan saat bulan/tahun berubah
                if (filterType !== "daily" && activeStartDate) {
                setValue([activeStartDate])
                }
            }}
            value={
            value instanceof Date
                ? value
                : Array.isArray(value) && value.length > 0 && value[0] instanceof Date
                ? value[0]
                : undefined
            }
            />

        </PopoverContent>
      </Popover>
    </div>
  )
}
