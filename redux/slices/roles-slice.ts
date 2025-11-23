// src/redux/slices/users-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role } from "@/types/role";
import { TableFilter, TablePaging } from "@/types/table";

interface RolesState {
  data: Role[];
  params: TableFilter;
  paging: TablePaging;
  loading: boolean;
  success: boolean;
  error: string;
}

const initialState: RolesState = {
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

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setRoles: (
      state,
      action: PayloadAction<{
        data?: Role[],
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
    errorRoles: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    successRoles: (state) => {
      state.success = true;
      state.loading = false;
    },
    resetRoles: (state) => {
      state.success = false;
      state.error = '';
    },
    clearRoles: () => initialState,
  },
});

export const { setLoading, setRoles, successRoles, errorRoles, resetRoles, clearRoles } = rolesSlice.actions;
export default rolesSlice.reducer;