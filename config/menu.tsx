import constants from "@/utils/constants";
import { Settings, ScrollText, LogOut, Server, SearchCode } from "lucide-react";
import { ReactNode } from "react";

type MenuItem = {
  key: string;
  label: string;
  path?: string;
  icon?: ReactNode;
  children?: MenuItem[];
};

export const menus: MenuItem[] = [
  {
    key: constants.menu.DASHBOARD.functionId,
    label: "Dashboard",
    icon: <Server size={18} />,
    path: constants.menu.DASHBOARD.path,
  },
  {
    key: constants.menu.QUERY.functionId,
    label: "Query",
    icon: <SearchCode size={18} />,
    path: constants.menu.QUERY.path,
  },
  {
    key: constants.menu.LOGS.functionId,
    label: "Logs",
    icon: <ScrollText size={18} />,
    path: constants.menu.LOGS.path,
  },
  {
    key: "master",
    label: "Master",
    icon: <Settings size={18} />,
    children: [
      {
        key: constants.menu.USERS.functionId,
        label: "Users",
        path: constants.menu.USERS.path,
      },
      {
        key: constants.menu.ROLES.functionId,
        label: "Roles",
        path: constants.menu.ROLES.path,
      },
      {
        key: constants.menu.DIVISION.functionId,
        label: "Division",
        path: constants.menu.DIVISION.path,
      },
    ],
  },
  {
    key: "logout",
    label: "Logout",
    icon: <LogOut size={18} />,
    path: "/logout",
  },
];
