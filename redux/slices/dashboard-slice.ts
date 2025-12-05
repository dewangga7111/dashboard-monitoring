// src/redux/slices/users-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dashboard } from "@/types/dashboard";
import { TableFilter, TablePaging } from "@/types/table";

interface DashboardState {
  data: Dashboard[];
  params: TableFilter;
  paging: TablePaging;
  loading: boolean;
  success: boolean;
  error: string;
}

const initialState: DashboardState = {
  data: [],
  params: {},
  paging: {
    page: 1,
    totalPage: 1,
    totalRows: 0,
    limit: 10,
  },
  loading: false,
  success: false,
  error: '',
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDashboard: (
      state,
      action: PayloadAction<{
        data?: Dashboard[],
        params?: TableFilter,
        paging?: TablePaging;
      }>
    ) => {
      if (action.payload.data !== undefined) {
        state.data = action.payload.data
      };
      if (action.payload.params !== undefined) state.params = action.payload.params;
      if (action.payload.paging !== undefined) state.paging = action.payload.paging;
      state.loading = false;
      state.error = '';
    },
    errorDashboard: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    successDashboard: (state) => {
      state.success = true;
      state.loading = false;
    },
    resetDashboard: (state) => {
      state.success = false;
      state.error = '';
    },
    clearDashboard: () => initialState,
  },
});

export const { setLoading, setDashboard, successDashboard, errorDashboard, resetDashboard, clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;