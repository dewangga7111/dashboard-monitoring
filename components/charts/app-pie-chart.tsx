"use client";

import { Card, CardBody } from "@heroui/react";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface AppPieChartProps {
  title?: string;
  data: PieData[];
  height?: number;
  showLegend?: boolean;
  withLabel?: boolean;
  innerRadius?: string | number;
}

export default function AppPieChart({
  title = "Pie Chart",
  data,
  height = 300,
  showLegend = true,
  withLabel = true,
  innerRadius = 0
}: AppPieChartProps) {
  // Default colors if not provided
  const defaultColors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Custom label renderer
  const renderLabel = ({ name, percent }: any) => {
    return `${(percent * 100).toFixed(0)}`;
  };

  // Adjust outer radius based on withLabel
  const outerRadius = withLabel ? 100 : 120;

  return (
    <Card className="">
      <CardBody>
        {title && <div className="font-semibold text-center mb-5">{title}</div>}

        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data as any}
              cx="50%"
              cy="50%"
              labelLine={withLabel}
              label={withLabel ? renderLabel : false}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || defaultColors[index % defaultColors.length]} 
                />
              ))}
            </Pie>
            {showLegend && (
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '14px'
                }}
                iconType="line"
                iconSize={10}
                align="left"
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}