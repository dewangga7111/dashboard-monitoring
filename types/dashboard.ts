import { Query } from "./query";

export type Dashboard = {
  id: number;
  name: string;
  host: string;
  description: string;
  status: "online" | "offline";
};

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
  chartData?: {
    chartSeries: any[];
    mergedData: any[];
  };
  loading?: boolean;
  error?: string[];
};
