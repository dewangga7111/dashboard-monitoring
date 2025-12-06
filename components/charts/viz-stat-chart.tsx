"use client";

import { Spinner } from "@heroui/react";

interface VizStatChartProps {
  data: any[];
  chartSeries: { name: string }[];
  loading?: boolean;
}

export default function VizStatChart({ data, chartSeries, loading = false }: VizStatChartProps) {
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

  // Extract latest value from each series
  const latestValues = chartSeries.map((series, i) => {
    const lastDataPoint = data[data.length - 1];
    return {
      name: series.name,
      value: lastDataPoint?.[series.name] ?? 0,
    };
  });

  // Determine grid columns based on number of stats
  const gridCols = latestValues.length === 1
    ? "grid-cols-1"
    : latestValues.length === 2
      ? "grid-cols-2"
      : latestValues.length === 3
        ? "grid-cols-3"
        : "grid-cols-2";

  return (
    <div className={`grid ${gridCols} gap-4 p-4 h-full`}>
      {latestValues.map((stat, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center p-4 bg-default-100 rounded-lg"
        >
          <div className="text-xs text-default-500 mb-2 text-center line-clamp-2">
            {stat.name}
          </div>
          <div
            className="text-3xl font-bold"
            style={{ color: `hsl(${(i * 137) % 360}, 70%, 50%)` }}
          >
            {typeof stat.value === "number"
              ? stat.value.toFixed(2)
              : stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}