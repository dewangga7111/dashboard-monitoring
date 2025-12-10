"use client";

import { Spinner } from "@heroui/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

interface VizGaugeChartProps {
  data: any[];
  chartSeries: { name: string }[];
  loading?: boolean;
  max?: number;
}

export default function VizGaugeChart({
  data,
  chartSeries,
  loading = false,
  max
}: VizGaugeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(48);

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
    const maxValue = max || Math.max(value * 1.2, 100);
    return {
      name: series.name,
      value: typeof value === 'number' ? value : parseFloat(value) || 0,
      max: maxValue,
      percentage: (value / maxValue) * 100,
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

      const perCellWidth = width / numCols;
      const size = Math.min(perCellWidth, height / 2) * 1.5;
      setGaugeSize(size);

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

  return (
    <div ref={containerRef} className={`grid ${gridClass} gap-4 h-full w-full p-4`}>
      {latestValues.map((stat, i) => (
        <div key={i} className="flex flex-col items-center justify-center h-full relative">
          <div
            className="text-default-500 text-center line-clamp-2 px-2 mb-2"
            style={{ fontSize: `${labelFontSize}px` }}
          >
            {stat.name}
          </div>

          {/* Gauge with dynamic height */}
          <GaugeComponent
            arc={{
              subArcs: [
                { limit: 20, color: '#EA4228', showTick: true },
                { limit: 40, color: '#F58B19', showTick: true },
                { limit: 60, color: '#F5CD19', showTick: true },
                { limit: 100, color: '#5BE12C', showTick: true },
              ]
            }}
            value={stat.value}
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
