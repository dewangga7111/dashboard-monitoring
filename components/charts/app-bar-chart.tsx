"use client";

import { AppBarChartProps } from "@/types/chart";
import { Card, CardBody } from "@heroui/react";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AppBarChart({
  title = "Bar Chart",
  data,
  yAxisLabel = "",
  yPrefix = "",
  ySuffix = "",
  showGrid = true,
  height = 300,
  stacked = false,
  barSize = 40,
  showLegend = true,
}: AppBarChartProps) {
  const transformedData = data.labels.map((label, index) => {
    const dataPoint: any = { name: label };
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  // Default colors if not provided
  const defaultColors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <Card className="">
      <CardBody>
        <div className="font-semibold text-center mb-5">{title}</div>

        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={transformedData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="0"
                stroke="#2a2a2a"
                vertical={false}
              />
            )}
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${yPrefix}${value}${ySuffix}`}
              label={yAxisLabel ? {
                value: yAxisLabel,
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#9ca3af', fontSize: 12 }
              } : undefined}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#fff'
              }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(value: number) => `${yPrefix}${value}${ySuffix}`}
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            />

            {showLegend && (
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px'
                }}
                iconType="line"
                iconSize={12}
                align="left"
              />
            )}
            {data.datasets.map((dataset, index) => {
              const color = dataset.backgroundColor || dataset.borderColor || defaultColors[index % defaultColors.length];
              return (
                <Bar
                  key={dataset.label}
                  dataKey={dataset.label}
                  name={dataset.label}
                  fill={color}
                  stackId={stacked ? "stack" : undefined}
                  radius={stacked ? undefined : [4, 4, 0, 0]}
                  barSize={barSize}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}