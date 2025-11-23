"use client";

import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  RangeCalendar,
} from "@heroui/react";
import { CalendarDays } from "lucide-react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { format } from "date-fns";
import AppTextInput from "./app-text-input";

type DateRangeValue = {
  start: string | null;
  end: string | null;
};

type DateRangeInputProps = {
  label?: string;
  placeholder?: string;
  value?: DateRangeValue | null;
  onChange?: (val: DateRangeValue | null) => void;
};

export default function AppDateRangePicker({
  label = "Date Range",
  placeholder = "DD-MM-YYYY - DD-MM-YYYY",
  value,
  onChange,
}: DateRangeInputProps) {
  const [open, setOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRangeValue | null>(
    value || null
  );

  // ✅ Sync internal state when parent clears or updates value
  useEffect(() => {
    setSelectedRange(value || null);
  }, [value]);

  const formatDate = (date: any) => {
    if (!date) return null;
    const jsDate = date.toDate(getLocalTimeZone());
    return format(jsDate, "dd-MM-yyyy");
  };

  const handleSelect = (range: any) => {
    if (!range?.start || !range?.end) return;
    const formatted = {
      start: formatDate(range.start),
      end: formatDate(range.end),
    };
    setSelectedRange(formatted);
    onChange?.(formatted);
    setOpen(false);
  };

  const displayValue =
    selectedRange?.start && selectedRange?.end
      ? `${selectedRange.start} - ${selectedRange.end}`
      : "";

  return (
    <div className="flex flex-col gap-1 relative">
      <Popover isOpen={open} onOpenChange={setOpen} placement="bottom-start">
        <div>
          {/* transparent layer for opening popover */}
          <PopoverTrigger>
            <div className="w-full h-[40px] cursor-pointer absolute z-10 bottom-0"></div>
          </PopoverTrigger>

          <AppTextInput
            label={label}
            readOnly
            placeholder={placeholder}
            value={displayValue}
            startContent={<CalendarDays size={18} />}
            className="cursor-pointer"
            classNames={{
              input: "text-left ml-1",
            }}
          />
        </div>

        <PopoverContent className="p-0">
          <RangeCalendar
            aria-label="Select date range"
            visibleMonths={2}
            value={
              selectedRange?.start && selectedRange?.end
                ? {
                  start: parseDate(
                    selectedRange.start.split("-").reverse().join("-")
                  ),
                  end: parseDate(
                    selectedRange.end.split("-").reverse().join("-")
                  ),
                }
                : undefined
            }
            onChange={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
