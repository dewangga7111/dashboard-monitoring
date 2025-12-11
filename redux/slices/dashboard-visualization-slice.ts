import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VisualizationData, ChartSettings } from "@/types/dashboard";
import { getDefaultChartSettings } from "@/utils/chart-defaults";

interface DashboardVisualizationState {
  visualizations: VisualizationData[];
  loading: boolean;
  error: string[];
  success: boolean;
}

const initialState: DashboardVisualizationState = {
  visualizations: [],
  loading: false,
  error: [],
  success: false,
};

const dashboardVisualizationSlice = createSlice({
  name: "dashboard-visualization",
  initialState,
  reducers: {
    setVisualizations: (state, action: PayloadAction<VisualizationData[]>) => {
      state.visualizations = action.payload.map(viz => ({
        ...viz,
        settings: viz.settings || getDefaultChartSettings(viz.type)
      }));
    },
    addVisualization: (state, action: PayloadAction<VisualizationData>) => {
      const visualization = action.payload;
      if (!visualization.settings) {
        visualization.settings = getDefaultChartSettings(visualization.type);
      }
      state.visualizations.push(visualization);
    },
    updateVisualizationData: (
      state,
      action: PayloadAction<{
        id: string;
        chartData: { chartSeries: any[]; mergedData: any[] };
      }>
    ) => {
      const viz = state.visualizations.find((v) => v.id === action.payload.id);
      if (viz) {
        viz.chartData = action.payload.chartData;
        viz.loading = false;
      }
    },
    setVisualizationLoading: (
      state,
      action: PayloadAction<{ id: string; loading: boolean }>
    ) => {
      const viz = state.visualizations.find((v) => v.id === action.payload.id);
      if (viz) {
        viz.loading = action.payload.loading;
      }
    },
    setVisualizationError: (
      state,
      action: PayloadAction<{ id: string; error: string[] }>
    ) => {
      const viz = state.visualizations.find((v) => v.id === action.payload.id);
      if (viz) {
        viz.error = action.payload.error;
        viz.loading = false;
      }
    },
    removeVisualization: (state, action: PayloadAction<string>) => {
      state.visualizations = state.visualizations.filter(
        (v) => v.id !== action.payload
      );
    },
    updateVisualizationLayout: (
      state,
      action: PayloadAction<{
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
      }>
    ) => {
      const viz = state.visualizations.find((v) => v.id === action.payload.id);
      if (viz) {
        viz.x = action.payload.x;
        viz.y = action.payload.y;
        viz.width = action.payload.width;
        viz.height = action.payload.height;
      }
    },
    updateVisualizationSettings: (
      state,
      action: PayloadAction<{
        id: string;
        settings: ChartSettings;
      }>
    ) => {
      const viz = state.visualizations.find((v) => v.id === action.payload.id);
      if (viz) {
        viz.settings = action.payload.settings;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string[]>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    clearDashboardVisualization: () => initialState,
  },
});

export const {
  setVisualizations,
  addVisualization,
  updateVisualizationData,
  setVisualizationLoading,
  setVisualizationError,
  removeVisualization,
  updateVisualizationLayout,
  updateVisualizationSettings,
  setLoading,
  setError,
  setSuccess,
  clearDashboardVisualization,
} = dashboardVisualizationSlice.actions;

export default dashboardVisualizationSlice.reducer;
