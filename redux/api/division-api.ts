// ----- EXAMPLE REAL API -----
// // src/redux/api/users-api.ts
// import { apiClient } from "./api-client";
// import { AppDispatch, RootState } from "@/redux/store";
// import {
//   setLoading,
//   setRoles,
//   errorRoles,
//   resetRoles,
//   successRoles,
// } from "@/redux/slices/roles-slice";
// import { Role } from "@/types/role";
// import { TableFilter } from "@/types/table";

// export const fetchRoles =
//   (param: TableFilter) =>
//     async (dispatch: AppDispatch) => {
//       try {
//         dispatch(setLoading(true));

//         // ✅ Add skip dynamically (without mutating the original param)
//         const response = await apiClient.get("/roles", {
//           params: { ...param, skip: ((param.page || 1) - 1) * (param.limit || 10) }
//         });

//         dispatch(setRoles({
//           data: response.data?.roles,
//           params: {
//             ...param,
//           },
//           paging: {
//             page: param.page || 1,
//             totalPage: Math.ceil(response.data?.total / param.limit || 10),
//             totalRows: response.data?.total,
//             limit: param.limit
//           }
//         }));
//       } catch (error: any) {
//         dispatch(errorRoles(error.response?.data?.message || error.message));
//       }
//     };



// export const createRole =
//   (role: Omit<Role, "id">) => async (dispatch: AppDispatch) => {
//     try {
//       dispatch(setLoading(true));
//       const response = await apiClient.post("/roles", role);
//       if (response.status == 200) {
//         dispatch(successRoles());
//       } else {
//         dispatch(errorRoles(response.data?.message || response.statusText));
//       }
//     } catch (error: any) {
//       dispatch(errorRoles(error.response?.data?.message || error.message));
//     } finally {
//       dispatch(resetRoles())
//     }
//   };

// export const updateRole =
//   (id: number, role: Partial<Role>) => async (dispatch: AppDispatch) => {
//     try {
//       dispatch(setLoading(true));
//       const response = await apiClient.put(`/roles/${id}`, role);
//       if (response.status == 200) {
//         dispatch(successRoles());
//       } else {
//         dispatch(errorRoles(response.data?.message || response.statusText));
//       }
//     } catch (error: any) {
//       dispatch(errorRoles(error.response?.data?.message || error.message));
//     } finally {
//       dispatch(resetRoles())
//     }
//   };

// export const deleteRole =
//   (id: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
//     try {
//       dispatch(setLoading(true));
//       const response = await apiClient.delete(`/roles/${id}`);
//       if (response.status == 200) {
//         dispatch(successRoles());
//       } else {
//         dispatch(errorRoles(response.data?.message || response.statusText));
//       }

//       const state = getState();
//       const lastParams = (state.roles as any)?.params || {};

//       dispatch(fetchRoles(lastParams));
//     } catch (error: any) {
//       dispatch(errorRoles(error.response?.data?.message || error.message));
//     }
//   };

// ----- MOCK API -----
import { AppDispatch, RootState } from "@/redux/store";
import {
  setLoading,
  setDivision,
  errorDivision,
  resetDivision,
  successDivision,
} from "@/redux/slices/division-slice";
import { Division } from "@/types/division";
import { TableFilter } from "@/types/table";
import { divisionList } from "@/dummy/division";

// ---- MOCK DATA ----

const simulateDelay = async (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ---- MOCKED ENDPOINTS ----
export const fetchDivision =
  (param: TableFilter) =>
    async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading(true));
        await simulateDelay();

        const limit = param.limit || 10;
        const page = param.page || 1;
        const skip = (page - 1) * limit;

        const pagedRoles = divisionList.slice(skip, skip + limit);

        // 🧠 Simulate real API response
        const response = {
          data: {
            data: pagedRoles,
            total: divisionList.length,
          },
        };

        dispatch(setDivision({
          data: response.data?.data,
          params: { ...param },
          paging: {
            page,
            totalPage: Math.ceil(response.data.total / limit),
            totalRows: response.data.total,
            limit,
          },
        }));
      } catch (error: any) {
        dispatch(errorDivision(error.message || "Failed to fetch mock roles"));
      }
    };

export const createDivision =
  (division: Omit<Division, "id">) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      await simulateDelay();

      const newDivision: Division = {
        id: divisionList.length ? Math.max(...divisionList.map(r => r.id)) + 1 : 1,
        ...division,
      };

      divisionList.push(newDivision);

      const response = { status: 200, data: { message: "Division created" } };
      if (response.status === 200) {
        dispatch(successDivision());
      } else {
        dispatch(errorDivision(response.data?.message || "Failed to create division"));
      }
    } catch (error: any) {
      dispatch(errorDivision(error.message || "Failed to create mock division"));
    } finally {
      dispatch(resetDivision());
    }
  };

export const updateDivision =
  (id: number, division: Partial<Division>) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      await simulateDelay();


      const response = { status: 200, data: { message: "Division updated" } };
      if (response.status === 200) {
        dispatch(successDivision());
      } else {
        dispatch(errorDivision(response.data?.message || "Failed to update division"));
      }
    } catch (error: any) {
      dispatch(errorDivision(error.message || "Failed to update mock division"));
    } finally {
      dispatch(resetDivision());
    }
  };

export const deleteDivision =
  (id: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setLoading(true));
      await simulateDelay();

      // mockRoles = mockRoles.filter(r => r.id !== id);

      const response = { status: 200, data: { message: "Division deleted" } };
      if (response.status === 200) {
        dispatch(successDivision());
      } else {
        dispatch(errorDivision(response.data?.message || "Failed to delete division"));
      }

      const state = getState();
      const lastParams = (state.division as any)?.params || {};
      dispatch(fetchDivision(lastParams));
    } catch (error: any) {
      dispatch(errorDivision(error.message || "Failed to delete mock division"));
    }
  };

