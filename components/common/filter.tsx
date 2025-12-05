"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Form,
} from "@heroui/react";
import { Search, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { FilterField } from "@/types/filter";
import AppDatePicker from "@/components/common/app-date-picker";
import AppDateRangePicker from "@/components/common/app-date-range-picker";
import AppAutocomplete from "./app-autocomplete";
import AppTextInput from "./app-text-input";
import { actionButtons, button } from "@/utils/primitives";

interface DynamicFilterProps {
  fields: FilterField[];
  onFilter: (data: Record<string, any>) => void;
  onClear: () => void;
}

export default function DynamicFilter({
  fields,
  onFilter,
  onClear,
}: DynamicFilterProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedValues: Record<string, any> = {};
    Object.entries(formValues).forEach(([key, value]) => {
      if (!value) return;
      formattedValues[key] = value;
    });

    onFilter(formattedValues);
  };

  const handleClear = () => {
    const clearedValues: Record<string, any> = {};
    fields.forEach((f) => {
      clearedValues[f.key] = null;
    });
    setFormValues(clearedValues);
    onClear();
  };

  return (
    <Card className="px-1 overflow-hidden">
      {/* Header with toggle */}
      <CardHeader
        className="flex justify-between items-center cursor-pointer select-none h-[45px]"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="font-semibold text-md">Filter</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <ChevronUp size={18} />
        </motion.div>
      </CardHeader>

      {/* Animated Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="filter-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <CardBody>
              <Form id="filterForm" onSubmit={handleSubmit}>
                <div className="w-full flex flex-col gap-4">
                  <div className={`grid sm:grid-cols-3 gap-4`}>
                    {fields.map((field) => {
                      const value = formValues[field.key];

                      switch (field.type) {
                        case "input":
                          return (
                            <AppTextInput
                              key={field.key}
                              label={field.label}
                              placeholder={field.placeholder}
                              value={value || ""}
                              onChange={(e) => handleChange(field.key, e.target.value)}
                            />
                          );

                        case "autocomplete":
                          return (
                            <AppAutocomplete
                              key={field.key}
                              label={field.label}
                              placeholder={field.placeholder}
                              selectedKey={value || ""}
                              items={field.options ?? []}
                              onSelectionChange={(v) => handleChange(field.key, v)}
                            />
                          );

                        case "datepicker":
                          return (
                            <AppDatePicker
                              key={field.key}
                              label={field.label}
                              value={value ?? null}
                              onChange={(v: any) => handleChange(field.key, v)}
                              withTime
                            />
                          );

                        case "daterange":
                          return (
                            <AppDateRangePicker
                              key={field.key}
                              label={field.label}
                              value={value ?? null}
                              onChange={(v) => handleChange(field.key, v)}
                            />
                          );

                        default:
                          return null;
                      }
                    })}
                  </div>

                  <div className={actionButtons()}>
                    <Button
                      type="button"
                      color="primary"
                      variant="flat"
                      className={button()}
                      onPress={handleClear}
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      className={button()}
                      startContent={<Search size={15} />}
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </Form>
            </CardBody>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
