import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VisualizationData } from "@/types/dashboard";

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
      console.log(action.payload)
      state.visualizations = action.payload;
    },
    addVisualization: (state, action: PayloadAction<VisualizationData>) => {
      state.visualizations.push(action.payload);
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
  setLoading,
  setError,
  setSuccess,
  clearDashboardVisualization,
} = dashboardVisualizationSlice.actions;

export default dashboardVisualizationSlice.reducer;
