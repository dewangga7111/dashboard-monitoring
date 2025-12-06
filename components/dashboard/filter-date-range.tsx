"use client";

import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  RangeCalendar,
  TimeInput,
  Button,
  Listbox,
  ListboxItem,
} from "@heroui/react";
import { CalendarDays } from "lucide-react";
import { parseDate, getLocalTimeZone, Time } from "@internationalized/date";
import moment from "moment";
import AppTextInput from "@/components/common/app-text-input";

type DateRangeValue = {
  start: string | null;
  end: string | null;
};

type DashboardFilterDateRangeProps = {
  label?: string;
  placeholder?: string;
  value?: DateRangeValue | null;
  className?: string;
  onChange?: (val: DateRangeValue | null) => void;
};

export default function DashboardFilterDateRange({
  label = "Date Range",
  placeholder = "DD-MM-YYYY HH:mm:ss - DD-MM-YYYY HH:mm:ss",
  value,
  className,
  onChange,
}: DashboardFilterDateRangeProps) {
  const [open, setOpen] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRangeValue | null>(value || null);

  // Temporary states
  const [tempRange, setTempRange] = useState<any>(null);
  const [tempStartTime, setTempStartTime] = useState<Time>(new Time(0, 0, 0));
  const [tempEndTime, setTempEndTime] = useState<Time>(new Time(23, 59, 59));

  const formatDisplayDateTime = (isoString: string) => {
    return moment(isoString).format("DD-MM-YYYY HH:mm:ss");
  };

  const getQuickRange = (type: string): DateRangeValue => {
    const now = moment();
    let startDate: moment.Moment;

    switch (type) {
      case "5m":
        startDate = moment().subtract(5, "minutes");
        break;
      case "15m":
        startDate = moment().subtract(15, "minutes");
        break;
      case "30m":
        startDate = moment().subtract(30, "minutes");
        break;
      case "1h":
        startDate = moment().subtract(1, "hour");
        break;
      case "6h":
        startDate = moment().subtract(6, "hours");
        break;
      case "12h":
        startDate = moment().subtract(12, "hours");
        break;
      case "24h":
        startDate = moment().subtract(24, "hours");
        break;
      case "7d":
        startDate = moment().subtract(7, "days");
        break;
      case "14d":
        startDate = moment().subtract(14, "days");
        break;
      default:
        return { start: null, end: null };
    }

    return {
      start: startDate.toISOString(),
      end: now.toISOString(),
    };
  };

  const handleQuickSelect = (key: string) => {
    if (key === "custom") {
      setShowCustomRange(true);
    } else {
      const range = getQuickRange(key);
      setSelectedRange(range);
      onChange?.(range);
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

  const handleRangeSelect = (range: any) => {
    setTempRange(range);
  };

  const handleApply = () => {
    if (!tempRange?.start || !tempRange?.end) return;

    const startDate = formatDate(tempRange.start);
    const endDate = formatDate(tempRange.end);

    const formatted = {
      start: createISOString(startDate!, tempStartTime),
      end: createISOString(endDate!, tempEndTime),
    };

    setSelectedRange(formatted);
    onChange?.(formatted);
    setShowCustomRange(false);
    setOpen(false);
  };

  const handleCancel = () => {
    if (selectedRange?.start && selectedRange?.end) {
      const startParsed = parseISODateTime(selectedRange.start);
      const endParsed = parseISODateTime(selectedRange.end);

      setTempRange({
        start: parseDate(moment(startParsed.date, "DD-MM-YYYY").format("YYYY-MM-DD")),
        end: parseDate(moment(endParsed.date, "DD-MM-YYYY").format("YYYY-MM-DD")),
      });
      setTempStartTime(startParsed.time);
      setTempEndTime(endParsed.time);
    } else {
      setTempRange(null);
      setTempStartTime(new Time(0, 0, 0));
      setTempEndTime(new Time(23, 59, 59));
    }
    setShowCustomRange(false);
    setOpen(false);
  };

  useEffect(() => {
    if (value?.start && value?.end) {
      setSelectedRange(value);

      const startParsed = parseISODateTime(value.start);
      const endParsed = parseISODateTime(value.end);

      setTempRange({
        start: parseDate(moment(startParsed.date, "DD-MM-YYYY").format("YYYY-MM-DD")),
        end: parseDate(moment(endParsed.date, "DD-MM-YYYY").format("YYYY-MM-DD")),
      });
      setTempStartTime(startParsed.time);
      setTempEndTime(endParsed.time);
    } else {
      setSelectedRange(null);
      setTempRange(null);
    }
  }, [value]);

  const displayValue =
    selectedRange?.start && selectedRange?.end
      ? `${formatDisplayDateTime(selectedRange.start)} - ${formatDisplayDateTime(selectedRange.end)}`
      : "";

  return (
    <div className={'flex flex-col gap-1 relative w-[340px] ' + className}>
      <Popover
        isOpen={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setShowCustomRange(false);
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
          {!showCustomRange ? (
            <Listbox
              aria-label="Time range options"
              onAction={(key) => handleQuickSelect(key as string)}
              className="p-2"
            >
              <ListboxItem key="5m">Last 5 minutes</ListboxItem>
              <ListboxItem key="15m">Last 15 minutes</ListboxItem>
              <ListboxItem key="30m">Last 30 minutes</ListboxItem>
              <ListboxItem key="1h">Last 1 hour</ListboxItem>
              <ListboxItem key="6h">Last 6 hours</ListboxItem>
              <ListboxItem key="12h">Last 12 hours</ListboxItem>
              <ListboxItem key="24h">Last 24 hours</ListboxItem>
              <ListboxItem key="7d">Last 7 days</ListboxItem>
              <ListboxItem key="14d">Last 14 days</ListboxItem>
              <ListboxItem key="custom">
                Custom Time Range
              </ListboxItem>
            </Listbox>
          ) : (
            <>
              <RangeCalendar
                aria-label="Select date range"
                visibleMonths={2}
                value={tempRange}
                onChange={handleRangeSelect}
              />

              <div className="grid grid-cols-2 justify-between w-full gap-4 p-4">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Start Time</p>
                  <TimeInput
                    granularity="second"
                    value={tempStartTime}
                    onChange={(value: any) => setTempStartTime(value)}
                    hourCycle={24}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">End Time</p>
                  <TimeInput
                    granularity="second"
                    value={tempEndTime}
                    onChange={(value: any) => setTempEndTime(value)}
                    hourCycle={24}
                  />
                </div>
                <Button
                  size="sm"
                  variant="flat"
                  onPress={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  onPress={handleApply}
                  isDisabled={!tempRange?.start || !tempRange?.end}
                >
                  Apply
                </Button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}