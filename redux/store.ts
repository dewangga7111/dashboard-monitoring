import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/users-slice";
import rolesReducer from "./slices/roles-slice";
import divisionReducer from "./slices/division-slice";
import dashboardReducer from "./slices/dashboard-slice";
import networkReducer from "./slices/network-slice";
import logsReducer from "./slices/logs-slice";
import prometheusReducer from "./slices/prometheus-slice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    roles: rolesReducer,
    division: divisionReducer,
    dashboard: dashboardReducer,
    network: networkReducer,
    logs: logsReducer,
    prometheus: prometheusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;