import { Server } from "@/types/server";

// helper to simulate random server status
const randomStatus = (): "online" | "offline" =>
  Math.random() > 0.3 ? "online" : "offline"; // 70% online, 30% offline

export const serversList: Server[] = [
  {
    id: 1,
    server_name: "Production Server",
    host: "192.168.1.10",
    description: "Main production environment for live applications",
    status: randomStatus(),
  },
  {
    id: 2,
    server_name: "Staging Server",
    host: "192.168.1.20",
    description: "Pre-production staging environment",
    status: randomStatus(),
  },
  {
    id: 3,
    server_name: "Development Server",
    host: "192.168.1.30",
    description: "Internal development environment",
    status: randomStatus(),
  },
  {
    id: 4,
    server_name: "Analytics Server",
    host: "192.168.1.40",
    description: "Server dedicated to BI & analytics computation",
    status: randomStatus(),
  },
  {
    id: 5,
    server_name: "Backup Server",
    host: "192.168.1.50",
    description: "Daily snapshots and backup storage",
    status: randomStatus(),
  },
];
