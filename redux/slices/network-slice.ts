// src/redux/slices/users-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Server } from "@/types/server";
import { TableFilter, TablePaging } from "@/types/table";

interface NetworkState {
  data: Server[];
  params: TableFilter;
  paging: TablePaging;
  loading: boolean;
  success: boolean;
  error: string;
}

const initialState: NetworkState = {
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

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setNetwork: (
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
    errorNetwork: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    successNetwork: (state) => {
      state.success = true;
      state.loading = false;
    },
    resetNetwork: (state) => {
      state.success = false;
      state.error = '';
    },
    clearNetwork: () => initialState,
  },
});

export const { setLoading, setNetwork, successNetwork, errorNetwork, resetNetwork, clearNetwork } = networkSlice.actions;
export default networkSlice.reducer;