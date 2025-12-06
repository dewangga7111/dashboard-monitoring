"use client";

import { Spinner } from "@heroui/react";
import { useTheme } from "next-themes";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface VizLineChartProps {
  data: any[];
  chartSeries: { name: string }[];
  loading?: boolean;
}

export default function VizLineChart({ data, chartSeries, loading = false }: VizLineChartProps) {
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

  const maxLegendHeight = 150;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
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
        />
        <CartesianGrid strokeDasharray="0" stroke="#6b7280" vertical={false} />

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
          labelFormatter={(label, payload: any) =>
            payload?.[0]?.payload?.fullTime ?? label
          }
        />

        <Legend
          wrapperStyle={{
            paddingTop: "20px",
            fontSize: "11px",
            maxHeight: `${maxLegendHeight}px`,
            overflowY: "auto",
            overflowX: "hidden"
          }}
          iconType="line"
          iconSize={12}
          align="left"
        />

        {chartSeries.map((series, i) => (
          <Line
            key={series.name}
            type="monotone"
            dataKey={series.name}
            dot={false}
            stroke={`hsl(${(i * 137) % 360}, 70%, 50%)`}
            strokeWidth={2}
            activeDot={{
              r: 4,
              fill: `hsl(${(i * 137) % 360}, 70%, 50%)`
            }}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}