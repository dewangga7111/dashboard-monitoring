"use client";

import { AppLineChartProps } from "@/types/chart";
import { Card, CardBody } from "@heroui/react";
import React, { useId } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

interface ExtendedProps extends AppLineChartProps {
  showLegend?: boolean;
  removeWrapper?: boolean;
}

export default function AppLineChart({
  title = "Usage",
  data,
  yAxisLabel = "",
  yPrefix = "",
  ySuffix = "",
  showGrid = true,
  height = 300,
  withArea = false,
  showLegend = true,
  removeWrapper = false
}: ExtendedProps) {
  const uniqueId = useId();

  const transformedData = data.labels.map((label, index) => {
    const dataPoint: any = { time: label };
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  const defaultColors = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899"
  ];

  const ChartComponent = withArea ? AreaChart : LineChart;

  const Wrapper = removeWrapper ? "div" : Card;
  const InnerWrapper = removeWrapper ? "div" : CardBody;

  return (
    <Wrapper className={removeWrapper ? "" : ""}>
      <InnerWrapper>
        <div className="font-semibold text-center mb-5">{title}</div>

        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent
            data={transformedData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            {withArea && (
              <defs>
                {data.datasets.map((dataset, index) => {
                  const color =
                    dataset.borderColor ||
                    defaultColors[index % defaultColors.length];
                  const gradientId = `gradient-${uniqueId}-${index}`;
                  return (
                    <linearGradient
                      key={gradientId}
                      id={gradientId}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                    </linearGradient>
                  );
                })}
              </defs>
            )}

            {showGrid && (
              <CartesianGrid strokeDasharray="0" stroke="#2a2a2a" vertical={false} />
            )}

            <XAxis
              dataKey="time"
              stroke="#6b7280"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${yPrefix}${value}${ySuffix}`}
              label={
                yAxisLabel
                  ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#9ca3af", fontSize: 12 }
                  }
                  : undefined
              }
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
                color: "#fff"
              }}
              labelStyle={{ color: "#9ca3af" }}
              formatter={(value: number) => `${yPrefix}${value}${ySuffix}`}
            />

            {showLegend && (
              <Legend
                wrapperStyle={{ paddingTop: "20px", fontSize: "14px" }}
                iconType="line"
                iconSize={12}
                align="left"
              />
            )}

            {withArea
              ? data.datasets.map((dataset, index) => {
                const color =
                  dataset.borderColor ||
                  defaultColors[index % defaultColors.length];
                const gradientId = `gradient-${uniqueId}-${index}`;
                return (
                  <Area
                    key={dataset.label}
                    type="monotone"
                    dataKey={dataset.label}
                    name={dataset.label}
                    stroke={color}
                    strokeWidth={2}
                    fill={`url(#${gradientId})`}
                    dot={false}
                    activeDot={{ r: 4, fill: color }}
                  />
                );
              })
              : data.datasets.map((dataset, index) => (
                <Line
                  key={dataset.label}
                  type="monotone"
                  dataKey={dataset.label}
                  name={dataset.label}
                  stroke={
                    dataset.borderColor ||
                    defaultColors[index % defaultColors.length]
                  }
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill:
                      dataset.borderColor ||
                      defaultColors[index % defaultColors.length]
                  }}
                />
              ))}
          </ChartComponent>
        </ResponsiveContainer>
      </InnerWrapper>
    </Wrapper>
  );
}
