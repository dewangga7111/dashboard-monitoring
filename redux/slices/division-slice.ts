// src/redux/slices/users-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Division } from "@/types/division";
import { TableFilter, TablePaging } from "@/types/table";

interface DivisionState {
  data: Division[];
  params: TableFilter;
  paging: TablePaging;
  loading: boolean;
  success: boolean;
  error: string;
}

const initialState: DivisionState = {
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

const divisionSlice = createSlice({
  name: "division",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDivision: (
      state,
      action: PayloadAction<{
        data?: Division[],
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
    errorDivision: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    successDivision: (state) => {
      state.success = true;
      state.loading = false;
    },
    resetDivision: (state) => {
      state.success = false;
      state.error = '';
    },
    clearDivision: () => initialState,
  },
});

export const { setLoading, setDivision, successDivision, errorDivision, resetDivision, clearDivision } = divisionSlice.actions;
export default divisionSlice.reducer;