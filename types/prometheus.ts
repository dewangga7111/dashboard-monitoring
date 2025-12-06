export interface PrometheusResponse {
  status: string;
  data?: {
    resultType: string;
    result: Array<{
      metric: Record<string, string>;
      value: [number, string]; // [timestamp, value]
    }>;
  };
  error?: string;
  errorType?: string;
}