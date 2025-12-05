import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TableRowType } from "@/types/table";

interface PromState {
  chartSeries: any[];
  mergedData: any[];
  tableData: TableRowType[];  // NEW: Add this for table view
  loading: boolean;
  error: string[];
  activeTab: "table" | "graph";
}

const initialState: PromState = {
  chartSeries: [],
  mergedData: [],
  tableData: [],  // NEW: Add this
  loading: false,
  error: [],
  activeTab: "table",
};

const prometheusSlice = createSlice({
  name: "prometheus",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setChartSeries: (state, action: PayloadAction<any[]>) => {
      state.chartSeries = action.payload;
      state.loading = false;
    },
    setMergedData: (state, action: PayloadAction<any[]>) => {
      state.mergedData = action.payload;
    },
    setTableData: (state, action: PayloadAction<TableRowType[]>) => {  // NEW: Add this reducer
      state.tableData = action.payload;
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string[]>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setActiveTab: (state, action: PayloadAction<"table" | "graph">) => {
      state.activeTab = action.payload;
    },
    clearPrometheus: () => initialState,
  },
});

export const {
  setLoading,
  setChartSeries,
  setMergedData,
  setTableData,  // NEW: Export this
  setError,
  setActiveTab,
  clearPrometheus,
} = prometheusSlice.actions;

export default prometheusSlice.reducer;