export type Logs = {
  id: number;
  service_name: string;
  host: string;
  description: string;
  log_count_debug: number;
  log_count_info: number;
  log_count_warning: number;
  log_count_error: number;
};
