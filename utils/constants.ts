const moduleConfig = {
  menu: {
    MENU_ID_USER: "USERS_PAGE",
    MENU_ID_ROLE: "ROLES_PAGE",
    MENU_ID_DIVISION: "DIVISION_PAGE",
    MENU_ID_SERVER: "SERVER_PAGE",
    MENU_ID_NETWORK: "NETWORK_PAGE",
    MENU_ID_LOGS: "LOGS_PAGE",
  },
  path: {
    USERS: "/users",
    ROLES: "/roles",
    DIVISION: "/division",
    SERVER: "/server",
    NETWORK: "/network",
    LOGS: "/logs",
    UNAUTHORIZED: "/misc/403",
    LOGIN: "/auth/login",
  },
  confirmation: {
    DELETE: "Are you sure you want to delete this data?",
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
