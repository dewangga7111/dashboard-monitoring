"use client";

import { Spinner } from "@heroui/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { GaugeChartSettings } from "@/types/dashboard";
import { getDefaultChartSettings } from "@/utils/chart-defaults";
const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

interface VizGaugeChartProps {
  data: any[];
  chartSeries: { name: string }[];
  loading?: boolean;
  settings?: GaugeChartSettings;
}

export default function VizGaugeChart({
  data,
  chartSeries,
  loading = false,
  settings
}: VizGaugeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(48);

  // Get settings with fallback to defaults
  const chartSettings = settings || (getDefaultChartSettings("gauge") as GaugeChartSettings);

  // NEW: dynamic gauge size
  const [gaugeSize, setGaugeSize] = useState(120);

  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    if (count === 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3";
    return "grid-cols-4";
  };

  const latestValues = chartSeries.map((series, i) => {
    const lastDataPoint = data[data.length - 1];
    const value = lastDataPoint?.[series.name] ?? 0;
    const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    const maxValue = chartSettings.visual.max ?? Math.max(numericValue * 1.2, 100);
    return {
      name: series.name,
      value: numericValue,
      max: maxValue,
      percentage: (numericValue / maxValue) * 100,
      color: `hsl(${(i * 137) % 360}, 70%, 50%)`
    };
  });

  const gridClass = getGridClass(chartSeries.length);

  // Dynamic sizing for font + gauge
  useEffect(() => {
    const calculateSize = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      const minDimension = Math.min(width, height);

      const numCols =
        gridClass.includes("grid-cols-1") ? 1 :
        gridClass.includes("grid-cols-2") ? 2 :
        gridClass.includes("grid-cols-3") ? 3 :
        gridClass.includes("grid-cols-4") ? 4 : 1;

      const numRows = Math.ceil(chartSeries.length / numCols);
      const perCellWidth = width / numCols;
      const perCellHeight = height / numRows;

      // Account for padding and label space
      const horizontalPadding = 32; // grid gap + padding
      const verticalPadding = chartSettings.visual.showLabels ? 80 : 32; // extra space for labels

      const availableWidth = perCellWidth - horizontalPadding;
      const availableHeight = perCellHeight - verticalPadding;

      // Use most of the available space while ensuring it fits
      const size = Math.min(availableWidth, availableHeight * 1.2);

      setGaugeSize(Math.max(size, 100)); // minimum size of 100px

      // Original font-size logic
      const calculatedSize =
        chartSeries.length === 1
          ? Math.min(minDimension * 0.15, 80)
          : chartSeries.length <= 4
          ? Math.min(minDimension * 0.1, 60)
          : Math.min(minDimension * 0.08, 48);

      setFontSize(Math.max(calculatedSize, 20));
    };

    calculateSize();
    const observer = new ResizeObserver(calculateSize);
    observer.observe(containerRef.current as any);

    return () => observer.disconnect();
  }, [chartSeries.length, gridClass]);

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

  const labelFontSize = Math.max(fontSize * 0.3, 12);

  // Get the max value used across all gauges (use the highest to ensure consistent thresholds)
  const globalMaxValue = Math.max(...latestValues.map(v => v.max));

  return (
    <div ref={containerRef} className={`grid ${gridClass} gap-4 h-full w-full p-4`}>
      {latestValues.map((stat, i) => (
        <div key={i} className="flex flex-col items-center justify-center h-full relative">
          {chartSettings.visual.showLabels && (
            <div
              className="text-default-500 text-center line-clamp-2 px-2 mb-2"
              style={{ fontSize: `${labelFontSize}px` }}
            >
              {stat.name}
            </div>
          )}

          {/* Gauge with dynamic height */}
          <GaugeComponent
            arc={{
              subArcs: chartSettings.visual.thresholds
                .filter(limit => limit <= globalMaxValue)
                .map((limit, index) => ({
                  limit,
                  color: chartSettings.visual.colors[index] || '#ccc',
                  showTick: true,
                }))
            }}
            value={stat.value}
            maxValue={globalMaxValue}
            style={{
              width: gaugeSize,
              height: gaugeSize
            }}
          />
        </div>
      ))}
    </div>
  );
}
