"use client";

import { Spinner } from "@heroui/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { StatChartSettings } from "@/types/dashboard";
import { getDefaultChartSettings } from "@/utils/chart-defaults";
import { ResponsiveContainer, AreaChart, Area, YAxis } from "recharts";

interface VizStatChartProps {
  data: any[];
  chartSeries: { name: string }[];
  loading?: boolean;
  settings?: StatChartSettings;
}

export default function VizStatChart({ data, chartSeries, loading = false, settings }: VizStatChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(48);

  // Get settings with fallback to defaults
  const chartSettings = settings || (getDefaultChartSettings("stat") as StatChartSettings);

  // Calculate dynamic font size based on container dimensions
  useEffect(() => {
    const calculateFontSize = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      
      // Calculate font size based on container size
      // Using smaller dimension to ensure it fits
      const minDimension = Math.min(width, height);
      const numStats = latestValues.length;
      
      // Base calculation: larger containers = larger font, more stats = smaller font
      let calculatedSize;
      
      if (numStats === 1) {
        // Single stat gets the largest size
        calculatedSize = Math.min(minDimension * 0.25, 120);
      } else if (numStats <= 4) {
        // 2-4 stats get medium size
        calculatedSize = Math.min(minDimension * 0.15, 80);
      } else {
        // 5+ stats get smaller size
        calculatedSize = Math.min(minDimension * 0.1, 60);
      }
      
      setFontSize(Math.max(calculatedSize, 24)); // Minimum 24px
    };

    calculateFontSize();

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(calculateFontSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [chartSeries.length, data.length]);

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

  // Determine grid layout based on number of stats
  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    if (count === 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3";
    return "grid-cols-4";
  };

  const gridClass = getGridClass(latestValues.length);

  // Calculate label font size (proportional to value font size)
  const labelFontSize = Math.max(fontSize * 0.25, 10);

  // Check if sparkline is enabled
  const showSparkline = chartSettings.sparkline?.show ?? false;
  const sparklineHeight = chartSettings.sparkline?.height ?? 40;
  const gradientOpacity = chartSettings.sparkline?.gradientOpacity ?? 0.6;

  // Prepare sparkline data for each series
  const sparklineData = useMemo(() => {
    if (!showSparkline || !data || data.length === 0) return {};

    const result: Record<string, { value: number }[]> = {};
    chartSeries.forEach((series) => {
      result[series.name] = data.map((point) => ({
        value: point[series.name] ?? 0,
      }));
    });
    return result;
  }, [data, chartSeries, showSparkline]);

  // Generate unique gradient IDs for each series
  const getGradientId = (index: number) => `sparklineGradient-${index}`;

  return (
    <div ref={containerRef} className={`grid ${gridClass} gap-4 h-full w-full ${showSparkline ? 'p-0' : 'p-4'}`}>
      {latestValues.map((stat, i) => {
        const color = `hsl(${(i * 137) % 360}, 70%, 50%)`;
        const gradientId = getGradientId(i);

        return (
          <div
            key={i}
            className="flex flex-col items-center justify-center h-full relative overflow-hidden"
          >
            {/* Content wrapper - pushes content up when sparkline is shown */}
            <div className={`flex flex-col items-center justify-center ${showSparkline ? 'flex-1' : 'h-full'}`}>
              {/* Value */}
              <div
                className="font-bold leading-none"
                style={{
                  fontSize: `${fontSize}px`,
                  color: color
                }}
              >
                {typeof stat.value === "number"
                  ? stat.value.toFixed(chartSettings.display.decimalPlaces)
                  : stat.value}
              </div>

              {/* Label */}
              {chartSettings.display.showLabel && (
                <div
                  className="text-default-500 mb-2 text-center line-clamp-2 px-2"
                  style={{ fontSize: `${labelFontSize}px` }}
                >
                  {stat.name}
                </div>
              )}
            </div>

            {/* Sparkline Area Chart */}
            {showSparkline && sparklineData[stat.name] && (
              <div className="w-[calc(100%+2px)] absolute bottom-0 -left-[1px] -right-[1px]" style={{ height: `${sparklineHeight}%` }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={sparklineData[stat.name]}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={gradientOpacity} />
                        <stop offset="100%" stopColor={color} stopOpacity={gradientOpacity * 0.3} />
                      </linearGradient>
                    </defs>
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={color}
                      strokeWidth={1.5}
                      fill={`url(#${gradientId})`}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}