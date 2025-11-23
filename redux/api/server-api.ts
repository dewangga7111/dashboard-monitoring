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
  setServer,
  errorServer,
  resetServer,
  successServer,
} from "@/redux/slices/server-slice";
import { Server } from "@/types/server";
import { TableFilter } from "@/types/table";
import { serversList } from "@/dummy/server";

// ---- MOCK DATA ----

const simulateDelay = async (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ---- MOCKED ENDPOINTS ----
export const fetchServers =
  (param: TableFilter) =>
    async (dispatch: AppDispatch) => {
      try {
        dispatch(setLoading(true));
        await simulateDelay();

        const limit = param.limit || 10;
        const page = param.page || 1;
        const skip = (page - 1) * limit;

        const pagedServers = serversList.slice(skip, skip + limit);

        // 🧠 Simulate real API response
        const response = {
          data: {
            data: pagedServers,
            total: serversList.length,
          },
        };

        dispatch(setServer({
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
        dispatch(errorServer(error.message || "Failed to fetch mock servers"));
      }
    };

export const createServer =
  (server: Omit<Server, "id">) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      await simulateDelay();

      const newServer: Server = {
        id: serversList.length ? Math.max(...serversList.map(s => s.id)) + 1 : 1,
        ...server,
      };

      serversList.push(newServer);

      const response = { status: 200, data: { message: "Role created" } };
      if (response.status === 200) {
        dispatch(successServer());
      } else {
        dispatch(errorServer(response.data?.message || "Failed to create role"));
      }
    } catch (error: any) {
      dispatch(errorServer(error.message || "Failed to create mock role"));
    } finally {
      dispatch(resetServer());
    }
  };

export const updateServer =
  (id: number, server: Partial<Server>) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      await simulateDelay();


      const response = { status: 200, data: { message: "Role updated" } };
      if (response.status === 200) {
        dispatch(successServer());
      } else {
        dispatch(errorServer(response.data?.message || "Failed to update role"));
      }
    } catch (error: any) {
      dispatch(errorServer(error.message || "Failed to update mock role"));
    } finally {
      dispatch(resetServer());
    }
  };

export const deleteServer =
  (id: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setLoading(true));
      await simulateDelay();

      // mockRoles = mockRoles.filter(r => r.id !== id);

      const response = { status: 200, data: { message: "Role deleted" } };
      if (response.status === 200) {
        dispatch(successServer());
      } else {
        dispatch(errorServer(response.data?.message || "Failed to delete role"));
      }

      const state = getState();
      const lastParams = (state.roles as any)?.params || {};
      dispatch(fetchServers(lastParams));
    } catch (error: any) {
      dispatch(errorServer(error.message || "Failed to delete mock role"));
    }
  };

