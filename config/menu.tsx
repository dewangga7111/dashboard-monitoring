import constants from "@/utils/constants";
import { Home, Settings, ScrollText, LogOut, Server, Network, SearchCode } from "lucide-react";
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
    key: "HOME_PAGE",
    label: "Home",
    icon: <Home size={18} />,
    path: "/",
  },
  {
    key: constants.menu.MENU_ID_DASHBOARD,
    label: "Dashboard",
    icon: <Server size={18} />,
    path: "/dashboard",
  },
  {
    key: constants.menu.MENU_ID_QUERY,
    label: "Query",
    icon: <SearchCode size={18} />,
    path: "/query",
  },
  {
    key: constants.menu.MENU_ID_LOGS,
    label: "Logs",
    icon: <ScrollText size={18} />,
    path: "/logs",
  },
  {
    key: "master",
    label: "Master",
    icon: <Settings size={18} />,
    children: [
      {
        key: constants.menu.MENU_ID_USER,
        label: "Users",
        path: "/users",
      },
      {
        key: constants.menu.MENU_ID_ROLE,
        label: "Roles",
        path: "/roles",
      },
      {
        key: constants.menu.MENU_ID_DIVISION,
        label: "Division",
        path: "/division",
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
