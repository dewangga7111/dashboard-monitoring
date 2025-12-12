const moduleConfig = {
  menu: {
    DASHBOARD: { functionId: "F201", path: "/dashboard" },
    QUERY: { functionId: "F301", path: "/query" },
    LOGS: { functionId: "F401", path: "/logs" },
    USERS: { functionId: "F501", path: "/users" },
    ROLES: { functionId: "F502", path: "/roles" },
    DIVISION: { functionId: "F503", path: "/division" },
  },
  path: {
    UNAUTHORIZED: "/misc/403",
    LOGIN: "/auth/login",
  },
  get menuRoutes() {
    return Object.values(this.menu);
  },
  confirmation: {
    DELETE: "Are you sure you want to delete this data?",
    CLOSE_DRAWER: "You have unapplied changes in this visualization. Are you sure you want to discard these changes? Changes cannot be recovered.",
    SAVE: "Are you sure you want to save this data?",
    LOGOUT: "Are you sure you want to logout?"
  },
  toast: {
    SUCCESS_LOGIN: "Login Successfully",
    SUCCESS_DELETE: "Data Deleted Successfully",
    SUCCESS_SAVE: "Data Saved Successfully",
    SUCCESS_LOGOUT: "You have been loged out!"
  },
  permission: {
    READ: 'read',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete'
  }
};

export default moduleConfig;
