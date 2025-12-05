export type Dashboard = {
  id: number;
  name: string;
  host: string;
  description: string;
  status: "online" | "offline";
};
