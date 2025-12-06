"use client";

import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Calendar,
  TimeInput,
  Button,
  Listbox,
  ListboxItem,
} from "@heroui/react";
import { CalendarDays } from "lucide-react";
import { parseDate, getLocalTimeZone, Time } from "@internationalized/date";
import moment from "moment";
import AppTextInput from "@/components/common/app-text-input";

type DashboardFilterDateProps = {
  label?: string;
  placeholder?: string;
  value?: string | null; // ISO string
  className?: string;
  onChange?: (val: string | null) => void;
};

export default function DashboardFilterDate({
  label = "Time",
  placeholder = "DD-MM-YYYY HH:mm:ss",
  value,
  className,
  onChange,
}: DashboardFilterDateProps) {
  const [open, setOpen] = useState(false);
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(value || null);

  // Temporary states for custom time picker
  const [tempDate, setTempDate] = useState<any>(null);
  const [tempTime, setTempTime] = useState<Time>(new Time(0, 0, 0));

  const formatDisplayDateTime = (isoString: string) => {
    return moment(isoString).format("DD-MM-YYYY HH:mm:ss");
  };

  const getQuickTime = (type: string): string => {
    const now = moment();
    let targetTime: moment.Moment;

    switch (type) {
      case "now":
        targetTime = now;
        break;
      case "5m":
        targetTime = moment().subtract(5, "minutes");
        break;
      case "15m":
        targetTime = moment().subtract(15, "minutes");
        break;
      case "30m":
        targetTime = moment().subtract(30, "minutes");
        break;
      case "1h":
        targetTime = moment().subtract(1, "hour");
        break;
      case "6h":
        targetTime = moment().subtract(6, "hours");
        break;
      case "12h":
        targetTime = moment().subtract(12, "hours");
        break;
      case "24h":
        targetTime = moment().subtract(24, "hours");
        break;
      default:
        targetTime = now;
    }

    return targetTime.toISOString();
  };

  const handleQuickSelect = (key: string) => {
    if (key === "custom") {
      setShowCustomTime(true);
    } else {
      const time = getQuickTime(key);
      setSelectedTime(time);
      onChange?.(time);
      setOpen(false);
    }
  };

  const parseISODateTime = (isoString: string) => {
    const date = moment(isoString);
    return {
      date: date.format("DD-MM-YYYY"),
      time: new Time(date.hours(), date.minutes(), date.seconds()),
    };
  };

  const createISOString = (dateStr: string, time: Time) => {
    // dateStr is in format "DD-MM-YYYY"
    const date = moment(dateStr, "DD-MM-YYYY")
      .hours(time.hour)
      .minutes(time.minute)
      .seconds(time.second);
    return date.toISOString();
  };

  const formatDate = (date: any) => {
    if (!date) return null;
    const jsDate = date.toDate(getLocalTimeZone());
    return moment(jsDate).format("DD-MM-YYYY");
  };

  const handleDateSelect = (date: any) => {
    setTempDate(date);
  };

  const handleApply = () => {
    if (!tempDate) return;

    const dateStr = formatDate(tempDate);
    const formatted = createISOString(dateStr!, tempTime);

    setSelectedTime(formatted);
    onChange?.(formatted);
    setShowCustomTime(false);
    setOpen(false);
  };

  const handleCancel = () => {
    if (selectedTime) {
      const parsed = parseISODateTime(selectedTime);
      setTempDate(parseDate(moment(parsed.date, "DD-MM-YYYY").format("YYYY-MM-DD")));
      setTempTime(parsed.time);
    } else {
      setTempDate(null);
      setTempTime(new Time(0, 0, 0));
    }
    setShowCustomTime(false);
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedTime(null);
    onChange?.(null);
    setTempDate(null);
    setTempTime(new Time(0, 0, 0));
    setOpen(false);
  };

  useEffect(() => {
    if (value) {
      setSelectedTime(value);
      const parsed = parseISODateTime(value);
      setTempDate(parseDate(moment(parsed.date, "DD-MM-YYYY").format("YYYY-MM-DD")));
      setTempTime(parsed.time);
    } else {
      setSelectedTime(null);
      setTempDate(null);
      setTempTime(new Time(0, 0, 0));
    }
  }, [value]);

  const displayValue = selectedTime ? formatDisplayDateTime(selectedTime) : "";

  return (
    <div className={"flex flex-col gap-1 relative w-[180px] " + className}>
      <Popover
        isOpen={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setShowCustomTime(false);
          }
        }}
        placement="bottom-start"
      >
        <div>
          <PopoverTrigger>
            <div className="w-full h-[40px] cursor-pointer absolute z-10 bottom-0"></div>
          </PopoverTrigger>

          <AppTextInput
            readOnly
            placeholder={placeholder}
            value={displayValue}
            startContent={<CalendarDays size={18} />}
            className="cursor-pointer"
            classNames={{
              input: "text-left ml-1",
            }}
            size="sm"
          />
        </div>

        <PopoverContent className="p-0">
          {!showCustomTime ? (
            <>
              <Listbox
                aria-label="Time options"
                onAction={(key) => handleQuickSelect(key as string)}
                className="p-2"
              >
                <ListboxItem key="now">Now</ListboxItem>
                <ListboxItem key="5m">5 minutes ago</ListboxItem>
                <ListboxItem key="15m">15 minutes ago</ListboxItem>
                <ListboxItem key="30m">30 minutes ago</ListboxItem>
                <ListboxItem key="1h">1 hour ago</ListboxItem>
                <ListboxItem key="6h">6 hours ago</ListboxItem>
                <ListboxItem key="12h">12 hours ago</ListboxItem>
                <ListboxItem key="24h">24 hours ago</ListboxItem>
                <ListboxItem key="custom">Custom Time</ListboxItem>
              </Listbox>
            </>
          ) : (
            <>
              <Calendar
                aria-label="Select date"
                value={tempDate}
                onChange={handleDateSelect}
              />

              <div className="flex flex-col gap-4 p-4 w-full">
                <div>
                  <TimeInput
                    granularity="second"
                    value={tempTime}
                    onChange={(value: any) => setTempTime(value)}
                    hourCycle={24}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="flat" onPress={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    onPress={handleApply}
                    isDisabled={!tempDate}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}