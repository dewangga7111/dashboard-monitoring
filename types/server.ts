export type Server = {
  id: number;
  server_name: string;
  host: string;
  description: string;
  status: "online" | "offline";
};
