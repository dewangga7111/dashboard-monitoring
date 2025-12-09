"use client";

import { Spinner } from "@heroui/react";
import { useTheme } from "next-themes";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

interface VizPieChartProps {
  data: any[];
  chartSeries: { name: string }[];
  loading?: boolean;
}

export default function VizPieChart({ data, chartSeries, loading = false }: VizPieChartProps) {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" variant="wave" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        No data available
      </div>
    );
  }

  const latestValues = chartSeries.map((series, i) => {
    const lastDataPoint = data[data.length - 1];
    return {
      name: series.name,
      value: lastDataPoint?.[series.name] ?? 0,
    };
  });
  
  const renderLabel = (data: any) => {
    return `${data.value}`;
  };

  const maxLegendHeight = 150;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "light" ? "#fff" : "#1f2937",
            borderRadius: "0.5rem",
            color: theme === "light" ? "#000" : "#fff",
            border: `1px solid ${theme === "light" ? "#e5e7eb" : "#374151"}`,
            zIndex: 1000
          }}
          wrapperStyle={{
            zIndex: 1000
          }}
          labelStyle={{ color: theme === "light" ? "#000" : "#fff" }}
        />

        <Pie
          data={latestValues}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="80%"
          fill="#8884d8"
          isAnimationActive={false}
          label={renderLabel}
        >
          {latestValues.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={`hsl(${(index * 137) % 360}, 70%, 50%)`}
            />
          ))}
        </Pie>

        <Legend
          wrapperStyle={{
            paddingTop: "20px",
            fontSize: "11px",
            maxHeight: `${maxLegendHeight}px`,
            overflowY: "auto",
            overflowX: "hidden"
          }}
          iconType="rect"
          iconSize={12}
          align="left"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}