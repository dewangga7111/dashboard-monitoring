"use client";

import { useEffect, useState, useId } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface BigNumberMetricProps {
  title: string;
  data: number[];
  unit?: string; // %, ms, GB, etc.
}

export default function BigNumberMetric({ title, data, unit = "%" }: BigNumberMetricProps) {
  const [sparkline, setSparkline] = useState(data.map((v) => ({ value: v })));
  
  // Generate unique ID for this component instance
  const uniqueId = useId();
  const gradientId = `metricGradient-${uniqueId}`;

  // Get latest value
  const latest = sparkline[sparkline.length - 1].value;

  // Determine status color (modify as needed)
  const getStatusColor = (value: number) => {
    if (value < 50) return "#22c55e"; // green
    if (value < 80) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  const color = getStatusColor(latest);

  // Auto-animate sparkline
  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = Math.random() * 100;
      setSparkline((prev) => [...prev.slice(1), { value: newValue }]);
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-content1 rounded-xl p-5 w-full h-full flex flex-col justify-between">
      {/* Title */}
      <div className="font-semibold text-center">{title}</div>

      {/* Big Value */}
      <div
        className="text-center text-5xl font-bold"
        style={{ color }}
      >
        {latest.toFixed(1)}
        <span className="text-2xl ml-1 opacity-80">{unit}</span>
      </div>

      {/* Sparkline Area Chart */}
      <div className="w-full h-10 -mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkline}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#${gradientId})`}
              strokeWidth={2}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}