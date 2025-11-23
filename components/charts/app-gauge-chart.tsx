"use client";

import { AppGaugeChartProps } from "@/types/chart";
import { Card, CardBody } from "@heroui/react";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function AppGaugeChart({
  title = "Gauge",
  value,
  max,
  unit = "",
  color = "#22c55e",
  height = 300,
  withWrapper = true
}: AppGaugeChartProps) {
  // Data for the gauge
  const gaugeData = [
    { name: 'value', value: value },
    { name: 'remaining', value: max - value }
  ];

  // Dummy background circle
  const dataDummy = [{ name: '', value: 100 }];

  const COLORS = [color, 'transparent'];

  const chartContent = (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          {/* Background arc */}
          <Pie
            data={dataDummy}
            dataKey="value"
            startAngle={225}
            endAngle={-45}
            innerRadius="80%"
            outerRadius="100%"
            fill="#434f64"
            cornerRadius={50}
            stroke="none"
          />

          {/* Value gauge arc */}
          <Pie
            data={gaugeData}
            startAngle={225}
            endAngle={-45}
            innerRadius="80%"
            outerRadius="100%"
            cornerRadius={50}
            stroke="none"
            dataKey="value"
          >
            {gaugeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: '35%' }}>
        <div className="text-5xl font-bold" style={{ color: color }}>
          {value}
        </div>
        <div className="text-base text-gray-400 mt-2">
          {unit}
        </div>
      </div>

      {/* Min and Max labels */}
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none text-sm text-gray-400" style={{ top: '75%', left: '15%', right: '15%' }}>
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  );

  if (!withWrapper) {
    return chartContent;
  }

  return (
    <Card>
      <CardBody>
        {title && <div className="font-semibold text-center mb-5">{title}</div>}
        {chartContent}
      </CardBody>
    </Card>
  );
}