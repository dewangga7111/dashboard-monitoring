export type Permission = {
  function_id: string;
  read: 'Y' | 'N';    // View/List records
  create: 'Y' | 'N';   // Add new records
  update: 'Y' | 'N';   // Edit existing records
  delete: 'Y' | 'N';   // Remove records
};

export const permissionList: Permission[] = [
  { function_id: "HOME_PAGE", read: "Y", create: "Y", update: "Y", delete: "Y" },
  { function_id: "USERS_PAGE", read: "Y", create: "Y", update: "Y", delete: "Y" },
  { function_id: "ROLES_PAGE", read: "Y", create: "Y", update: "Y", delete: "Y" },
  { function_id: "DIVISION_PAGE", read: "Y", create: "Y", update: "Y", delete: "Y" },
  { function_id: "DASHBOARD_PAGE", read: "Y", create: "Y", update: "Y", delete: "Y" },
  { function_id: "LOGS_PAGE", read: "Y", create: "Y", update: "Y", delete: "Y" },
  { function_id: "QUERY_PAGE", read: "Y", create: "Y", update: "Y", delete: "Y" },
]