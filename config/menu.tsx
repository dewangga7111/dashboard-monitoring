import { Home, Settings, ScrollText, LogOut, Server, Network } from "lucide-react";
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
    key: "SERVER_PAGE",
    label: "Server",
    icon: <Server size={18} />,
    path: "/server",
  },
  {
    key: "NETWORK_PAGE",
    label: "Network",
    icon: <Network size={18} />,
    path: "/network",
  },
  {
    key: "LOGS_PAGE",
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
        key: "USERS_PAGE",
        label: "Users",
        path: "/users",
      },
      {
        key: "ROLES_PAGE",
        label: "Roles",
        path: "/roles",
      },
      {
        key: "DIVISION_PAGE",
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
