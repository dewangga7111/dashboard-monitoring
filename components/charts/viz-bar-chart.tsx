"use client";

import { Spinner } from "@heroui/react";
import { useTheme } from "next-themes";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { BarChartSettings } from "@/types/dashboard";
import { getDefaultChartSettings } from "@/utils/chart-defaults";

interface VizBarChartProps {
  data: any[];
  chartSeries: { name: string }[];
  loading?: boolean;
  settings?: BarChartSettings;
}

export default function VizBarChart({ data, chartSeries, loading = false, settings }: VizBarChartProps) {
  const { theme } = useTheme();

  // Get settings with fallback to defaults
  const chartSettings = settings || (getDefaultChartSettings("bar") as BarChartSettings);

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
      <BarChart data={data}>
        {chartSettings.xAxis.show && (
          <XAxis
            dataKey="time"
            stroke="#6b7280"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
        )}
        {chartSettings.yAxis.show && (
          <YAxis
            stroke="#6b7280"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            label={chartSettings.yAxis.label ? {
              value: chartSettings.yAxis.label,
              angle: -90,
              position: 'insideLeft'
            } : undefined}
            domain={[
              chartSettings.yAxis.min ?? 'auto',
              chartSettings.yAxis.max ?? 'auto'
            ]}
          />
        )}
        <CartesianGrid
          strokeDasharray="0"
          stroke="#6b7280"
          vertical={chartSettings.grid.showVertical}
        />

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

        {chartSettings.legend.show && (
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
        )}

        {chartSeries.map((series, i) => (
          <Bar
            key={series.name}
            dataKey={series.name}
            fill={`hsl(${(i * 137) % 360}, 70%, 50%)`}
            barSize={chartSettings.visual.barSize}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}