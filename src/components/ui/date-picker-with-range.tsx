"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange | undefined;
  setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export default function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  const [localDate, setLocalDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const dateValue = date || localDate;
  const dateSetterValue = setDate || setLocalDate;

  return (
    <div className={cn("grid gap-2", className)}>
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={dateValue?.from}
        selected={dateValue}
        onSelect={dateSetterValue}
        numberOfMonths={2}
        className="border rounded-md p-3"
      />
    </div>
  );
}
