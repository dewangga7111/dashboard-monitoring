// src/redux/slices/users-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Server } from "@/types/server";
import { TableFilter, TablePaging } from "@/types/table";

interface ServerState {
  data: Server[];
  params: TableFilter;
  paging: TablePaging;
  loading: boolean;
  success: boolean;
  error: string;
}

const initialState: ServerState = {
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

const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setServer: (
      state,
      action: PayloadAction<{
        data?: Server[],
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
    errorServer: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    successServer: (state) => {
      state.success = true;
      state.loading = false;
    },
    resetServer: (state) => {
      state.success = false;
      state.error = '';
    },
    clearServer: () => initialState,
  },
});

export const { setLoading, setServer, successServer, errorServer, resetServer, clearServer } = serverSlice.actions;
export default serverSlice.reducer;