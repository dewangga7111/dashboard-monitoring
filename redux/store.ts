import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/users-slice";
import rolesReducer from "./slices/roles-slice";
import divisionReducer from "./slices/division-slice";
import serverReducer from "./slices/server-slice";
import networkReducer from "./slices/network-slice";
import logsReducer from "./slices/logs-slice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    roles: rolesReducer,
    division: divisionReducer,
    server: serverReducer,
    network: networkReducer,
    logs: logsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;