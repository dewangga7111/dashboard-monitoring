"use client";

import { Spinner } from "@heroui/react";
import { useTheme } from "next-themes";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from "recharts";

interface AppLineChartProps {
  data: any[];
  chartSeries: { name: string }[];
  loading: boolean;
}

export default function AppLineChart({ data, chartSeries, loading }: AppLineChartProps) {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        No data available
      </div>
    );
  }

  // Calculate approximate legend height based on number of series
  // Assuming ~30px per row and wrapping at certain width
  const estimatedLegendHeight = Math.ceil(chartSeries.length / 4) * 50;
  const chartHeight = 400;
  const containerHeight = chartHeight + estimatedLegendHeight + 40; // 40px extra padding

  return (
    <div style={{ height: `${containerHeight}px` }} className="mt-3 pr-5">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            stroke="#6b7280"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <CartesianGrid strokeDasharray="0" stroke="#6b7280" vertical={false} />

          <RechartsTooltip
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
            wrapperStyle={{ paddingTop: "20px", fontSize: "14px" }}
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
    </div>
  );
}