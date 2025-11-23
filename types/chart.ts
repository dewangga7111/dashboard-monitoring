export interface Dataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface AppLineChartProps {
  title: string;
  data: ChartData;
  yAxisLabel?: string;
  yPrefix?: string;
  ySuffix?: string;
  showGrid?: boolean;
  height?: number;
  withArea?: boolean;
}

export interface AppBarChartProps {
  title?: string;
  data: ChartData;
  yAxisLabel?: string;
  yPrefix?: string;
  ySuffix?: string;
  showGrid?: boolean;
  height?: number;
  stacked?: boolean;
  barSize?: number;
  showLegend?: boolean;
}

export interface AppGaugeChartProps {
  title?: string;
  value: number;
  max: number;
  unit?: string;
  color?: string;
  height?: number;
  withWrapper?: boolean;
}