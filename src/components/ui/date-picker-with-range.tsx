"use client";

import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

type Props = {
  value?: DateRange;
  setValue?: (value: DateRange) => void;
};

export default function DateRangePickerButton({ value, setValue }: Props) {
  const [open, setOpen] = React.useState(false);

  const displayValue = () => {
    if (value?.from && value?.to) {
      return `${format(value.from, "MMM d, yyyy")} - ${format(value.to, "MMM d, yyyy")}`;
    }
    return "Pick a date range";
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            selectRange
            onChange={(val) => {
              const [from, to] = val as [Date, Date];
              setValue?.({ from, to });
              setOpen(false);
            }}
            value={
              value?.from && value?.to ? [value.from, value.to] : undefined
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
