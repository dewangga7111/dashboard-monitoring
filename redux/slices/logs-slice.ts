// src/redux/slices/users-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Logs } from "@/types/logs";
import { TableFilter, TablePaging } from "@/types/table";

interface LogsState {
  data: Logs[];
  params: TableFilter;
  paging: TablePaging;
  loading: boolean;
  success: boolean;
  error: string;
}

const initialState: LogsState = {
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

const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLogs: (
      state,
      action: PayloadAction<{
        data?: Logs[],
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
    errorLogs: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    successLogs: (state) => {
      state.success = true;
      state.loading = false;
    },
    resetLogs: (state) => {
      state.success = false;
      state.error = '';
    },
    clearLogs: () => initialState,
  },
});

export const { setLoading, setLogs, successLogs, errorLogs, resetLogs, clearLogs } = logsSlice.actions;
export default logsSlice.reducer;