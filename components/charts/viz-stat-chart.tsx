"use client";

import { Spinner } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

interface VizStatChartProps {
  data: any[];
  chartSeries: { name: string }[];
  loading?: boolean;
}

export default function VizStatChart({ data, chartSeries, loading = false }: VizStatChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(48);

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

  return (
    <div ref={containerRef} className={`grid ${gridClass} gap-4 h-full w-full p-4`}>
      {latestValues.map((stat, i) => {
        const color = `hsl(${(i * 137) % 360}, 70%, 50%)`;
        
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-center h-full"
          >
            {/* Value */}
            <div
              className="font-bold leading-none"
              style={{ 
                fontSize: `${fontSize}px`,
                color: color
              }}
            >
              {typeof stat.value === "number"
                ? stat.value.toFixed(2)
                : stat.value}
            </div>
            
            {/* Label */}
            <div 
              className="text-default-500 mb-2 text-center line-clamp-2 px-2"
              style={{ fontSize: `${labelFontSize}px` }}
            >
              {stat.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}