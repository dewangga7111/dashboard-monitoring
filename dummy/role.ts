import { Role } from "@/types/role";

export const  rolesList: Role[] = [
  { id: 1, role_name: "Admin", description: "Full access to all modules" },
  { id: 2, role_name: "Editor", description: "Can edit and publish content" },
  { id: 3, role_name: "Viewer", description: "Can only view data" },
  { id: 4, role_name: "Manager", description: "Manage team and reports" },
  { id: 5, role_name: "Support", description: "Handle customer tickets" },
];