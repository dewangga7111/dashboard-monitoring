"use client";

import React, { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent, Calendar } from "@heroui/react";
import { CalendarDays } from "lucide-react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { format } from "date-fns";
import AppTextInput from "./app-text-input";

type DateInputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
};

export default function AppDatePicker({
  label = "Date",
  placeholder = "DD-MM-YYYY",
  value,
  onChange,
}: DateInputProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(value || null);

  const handleSelect = (date: any) => {
    const jsDate = date.toDate(getLocalTimeZone());
    const formatted = format(jsDate, "dd-MM-yyyy");
    setSelectedDate(formatted);
    onChange?.(formatted);
    setOpen(false);
  };
  
  useEffect(() => {
    setSelectedDate(value || null);
  }, [value]);

  return (
    <div className="flex flex-col gap-1 relative">
      <Popover isOpen={open} onOpenChange={setOpen} placement="bottom-start">
        <div>
          <PopoverTrigger>
            {/* trigger disini karena kalo trigger di input placeholder di input ketutup PopoverTrigger */}
            <div className="w-full h-[40px] cursor-pointer absolute z-1 bottom-0"></div> 
          </PopoverTrigger>
          <AppTextInput
            label={label}
            readOnly
            placeholder={placeholder}
            value={selectedDate || ""}
            startContent={<CalendarDays size={18} />}
            className="cursor-pointer"
            classNames={{
              input: "text-left ml-1",
            }}
          />
        </div>
        <PopoverContent className="p-0">
          <Calendar
            aria-label="Select date"
            value={selectedDate ? parseDate(selectedDate.split("-").reverse().join("-")) : undefined}
            onChange={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
