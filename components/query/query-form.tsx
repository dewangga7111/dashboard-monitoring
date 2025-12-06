"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Form,
} from "@heroui/react";
import { ChevronUp, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { button, inputLabel } from "@/utils/primitives";
import QueryInput from "./query-input";
import AppTextInput from "../common/app-text-input";

interface QueryFormProps {
  index: number;
  onSearch: (data: Record<string, any>) => void;
  valueExpression?: string;
  onChangeExpression?: (value: string) => void;
  valueLegend?: string;
  onChangeLegend?: (value: string) => void;
}

export default function QueryForm({
  index,
  onSearch,
  valueExpression,
  onChangeExpression,
  valueLegend,
  onChangeLegend,
}: QueryFormProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedValues: Record<string, any> = {};
    Object.entries(formValues).forEach(([key, value]) => {
      if (!value) return;
      formattedValues[key] = value;
    });

    onSearch(formattedValues);
  };

  return (
    <Card key={index} className="px-1 overflow-hidden">
      {/* Header with toggle */}
      <CardHeader
        className="flex justify-start items-center cursor-pointer select-none h-[45px]"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <ChevronUp size={18} />
        </motion.div>
        <span className="font-semibold text-sm ml-2">Query #{index}</span>
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
              <Form className="flex flex-col gap-4" id="filterForm" onSubmit={handleSubmit}>
                <AppTextInput
                  className="w-[50%]"
                  label="Legend"
                  value={valueLegend}
                  onChange={(e) => onChangeLegend?.(e.target.value)}
                />
                <div className="w-full">
                  <span className={inputLabel()}>PromQL Expression</span>
                  <div className="w-full flex items-center gap-4">
                    <div className="w-full">
                      <QueryInput value={valueExpression} onChange={onChangeExpression} />
                    </div>
                    <Button
                      type="submit"
                      color="primary"
                      className={button()}
                      startContent={<Play size={30} />}
                      size="sm"
                    >
                      Execute
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
