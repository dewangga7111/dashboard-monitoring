// src/redux/api/users-api.ts
import { apiClient } from "./api-client";
import { AppDispatch, RootState } from "@/redux/store";
import {
  setLoading,
  setUsers,
  errorUsers,
  resetUsers,
  successUsers,
} from "@/redux/slices/users-slice";
import { User } from "@/types/user";
import { TableFilter } from "@/types/table";

export const fetchUsers =
  (param: TableFilter) =>
    async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading(true));
        // ✅ Add skip dynamically (without mutating the original param)
        const response = await apiClient.get("/users", {
          params: { ...param, skip: ((param.page || 1) - 1) * (param.limit || 10) }
        });

        dispatch(setUsers({
          data: response.data?.users,
          params: {
            ...param,
          },
          paging: {
            page: param.page || 1,
            totalPage: Math.ceil(response.data?.total / param.limit || 10),
            totalRows: response.data?.total,
            limit: param.limit
          }
        }));
      } catch (error: any) {
        dispatch(errorUsers(error.response?.data?.message || error.message));
      }
    };



export const createUser =
  (user: Omit<User, "id">) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await apiClient.post("/users", user);
      if (response.status == 200) {
        dispatch(successUsers());
      } else {
        dispatch(errorUsers(response.data?.message || response.statusText));
      }
    } catch (error: any) {
      dispatch(errorUsers(error.response?.data?.message || error.message));
    } finally {
      dispatch(resetUsers())
    }
  };

export const updateUser =
  (id: number, user: Partial<User>) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await apiClient.put(`/users/${id}`, user);
      if (response.status == 200) {
        dispatch(successUsers());
      } else {
        dispatch(errorUsers(response.data?.message || response.statusText));
      }
    } catch (error: any) {
      dispatch(errorUsers(error.response?.data?.message || error.message));
    } finally {
      dispatch(resetUsers())
    }
  };

export const deleteUser =
  (id: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setLoading(true));
      const response = await apiClient.delete(`/users/${id}`);
      if (response.status == 200) {
        dispatch(successUsers());
      } else {
        dispatch(errorUsers(response.data?.message || response.statusText));
      }

      const state = getState();
      const lastParams = (state.users as any)?.params || {};

      dispatch(fetchUsers(lastParams));
    } catch (error: any) {
      dispatch(errorUsers(error.response?.data?.message || error.message));
    }
  };
