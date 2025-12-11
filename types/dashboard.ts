import { Query } from "./query";

export type Dashboard = {
  id: number;
  name: string;
  host: string;
  description: string;
  status: "online" | "offline";
};

// Base settings shared by charts with legends
type BaseChartSettings = {
  legend: { show: boolean };
};

// Line Chart Settings
export type LineChartSettings = BaseChartSettings & {
  type: "line";
  visual: {
    strokeWidth: number;
    lineType: "monotone" | "linear" | "step";
    showDots: boolean;
    connectNulls: boolean;
  };
  grid: { showVertical: boolean };
  yAxis: {
    show: boolean;
    shortValues: boolean;
    label?: string;
    max?: number;
    min?: number;
  };
  xAxis: { show: boolean };
};

// Area Chart Settings
export type AreaChartSettings = BaseChartSettings & {
  type: "area";
  visual: {
    strokeWidth: number;
    lineType: "monotone" | "linear" | "step";
    connectNulls: boolean;
    gradientOpacity: number;
  };
  grid: { showVertical: boolean };
  yAxis: {
    show: boolean;
    shortValues: boolean;
    label?: string;
    max?: number;
    min?: number;
  };
  xAxis: { show: boolean };
};

// Bar Chart Settings
export type BarChartSettings = BaseChartSettings & {
  type: "bar";
  visual: {
    barSize?: number;
  };
  grid: { showVertical: boolean };
  yAxis: {
    show: boolean;
    shortValues: boolean;
    label?: string;
    max?: number;
    min?: number;
  };
  xAxis: { show: boolean };
};

// Stat Chart Settings
export type StatChartSettings = {
  type: "stat";
  display: {
    decimalPlaces: number;
    showLabel: boolean;
    fontSize?: "auto" | "small" | "medium" | "large";
  };
};

// Pie Chart Settings
export type PieChartSettings = BaseChartSettings & {
  type: "pie";
  visual: {
    outerRadius: string;
    innerRadius?: string;
    showLabels: boolean;
    labelType: "value" | "percentage" | "name";
  };
};

// Gauge Chart Settings
export type GaugeChartSettings = {
  type: "gauge";
  visual: {
    thresholds: number[];
    colors: string[];
    max?: number;
    showLabels: boolean;
  };
};

// Union type for all chart settings
export type ChartSettings =
  | LineChartSettings
  | AreaChartSettings
  | BarChartSettings
  | StatChartSettings
  | PieChartSettings
  | GaugeChartSettings;

export type VisualizationData = {
  id: string;
  name: string;
  type: "line" | "area" | "bar" | "stat" | "pie" | "gauge";
  description: string;
  queries: Query[];
  x: number;
  y: number;
  width: number;
  height: number;
  settings?: ChartSettings;
  chartData?: {
    chartSeries: any[];
    mergedData: any[];
  };
  loading?: boolean;
  error?: string[];
};
