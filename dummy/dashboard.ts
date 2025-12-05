import { Dashboard } from "@/types/dashboard";

// helper to simulate random server status
const randomStatus = (): "online" | "offline" =>
  Math.random() > 0.3 ? "online" : "offline"; // 70% online, 30% offline

export const dashboardList: Dashboard[] = [
  {
    id: 1,
    name: "Production Server",
    host: "192.168.1.10",
    description: "Main production environment for live applications",
    status: randomStatus(),
  },
  {
    id: 2,
    name: "Staging Server",
    host: "192.168.1.20",
    description: "Pre-production staging environment",
    status: randomStatus(),
  },
  {
    id: 3,
    name: "Development Server",
    host: "192.168.1.30",
    description: "Internal development environment",
    status: randomStatus(),
  },
  {
    id: 4,
    name: "Analytics Server",
    host: "192.168.1.40",
    description: "Server dedicated to BI & analytics computation",
    status: randomStatus(),
  },
  {
    id: 5,
    name: "Backup Server",
    host: "192.168.1.50",
    description: "Daily snapshots and backup storage",
    status: randomStatus(),
  },
];
