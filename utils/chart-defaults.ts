import {
  ChartSettings,
  LineChartSettings,
  AreaChartSettings,
  BarChartSettings,
  StatChartSettings,
  PieChartSettings,
  GaugeChartSettings,
} from "@/types/dashboard";

export const getDefaultChartSettings = (
  type: "line" | "area" | "bar" | "stat" | "pie" | "gauge"
): ChartSettings => {
  switch (type) {
    case "line":
      return {
        type: "line",
        legend: { show: true },
        visual: {
          strokeWidth: 2,
          lineType: "monotone",
          showDots: false,
          connectNulls: true,
        },
        grid: { showVertical: false },
        yAxis: {
          show: true,
          shortValues: true,
        },
        xAxis: { show: true },
      } as LineChartSettings;

    case "area":
      return {
        type: "area",
        legend: { show: true },
        visual: {
          strokeWidth: 2,
          lineType: "monotone",
          connectNulls: true,
          gradientOpacity: 0.8,
        },
        grid: { showVertical: false },
        yAxis: {
          show: true,
          shortValues: true,
        },
        xAxis: { show: true },
      } as AreaChartSettings;

    case "bar":
      return {
        type: "bar",
        legend: { show: true },
        visual: {},
        grid: { showVertical: false },
        yAxis: {
          show: true,
          shortValues: true,
        },
        xAxis: { show: true },
      } as BarChartSettings;

    case "stat":
      return {
        type: "stat",
        display: {
          decimalPlaces: 2,
          showLabel: true,
          fontSize: "auto",
        },
        sparkline: {
          show: false,
          height: 40,
          gradientOpacity: 0.6,
        },
      } as StatChartSettings;

    case "pie":
      return {
        type: "pie",
        legend: { show: true },
        visual: {
          outerRadius: "80%",
          showLabels: true,
          labelType: "value",
        },
      } as PieChartSettings;

    case "gauge":
      return {
        type: "gauge",
        visual: {
          thresholds: [25, 50, 75, 100],
          colors: ["#EA4228", "#F58B19", "#F5CD19", "#5BE12C"],
          showLabels: true,
        },
      } as GaugeChartSettings;

    default:
      throw new Error(`Unknown chart type: ${type}`);
  }
};

// Helper to merge user settings with defaults (for partial updates)
export const mergeWithDefaults = (
  type: "line" | "area" | "bar" | "stat" | "pie" | "gauge",
  userSettings?: Partial<ChartSettings>
): ChartSettings => {
  const defaults = getDefaultChartSettings(type);
  if (!userSettings) return defaults;

  // Deep merge logic
  return { ...defaults, ...userSettings } as ChartSettings;
};
