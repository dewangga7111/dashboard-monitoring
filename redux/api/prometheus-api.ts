import { AppDispatch } from "@/redux/store";
import {
  setLoading,
  setChartSeries,
  setMergedData,
  setError,
  setActiveTab,
  setTableData,
  setMetricOptions
} from "@/redux/slices/prometheus-slice";
import { Query } from "@/types/query";
import moment from "moment";
import { apiClient } from "./api-client";
import { TableRowType } from "@/types/table";
import { PrometheusResponse } from "@/types/prometheus";

export const fetchPrometheusQueries =
  (queries: Query[], start: string, end: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError([]));

      const startUnix = moment(start).unix();
      const endUnix = moment(end).unix();

      const rangeSec = endUnix - startUnix;
      
      // Calculate optimal step based on time range
      let step: number;
      if (rangeSec <= 3600) {
        step = 15; // 15s for <= 1 hour
      } else if (rangeSec <= 21600) {
        step = 60; // 1m for <= 6 hours
      } else if (rangeSec <= 86400) {
        step = 300; // 5m for <= 1 day
      } else if (rangeSec <= 604800) {
        step = 1800; // 30m for <= 1 week
      } else {
        step = 3600; // 1h for > 1 week
      }

      // Determine date format based on step and range
      let dateFormat: string;
      if (step < 60) {
        // For steps less than 1 minute, show seconds
        dateFormat = "HH:mm:ss";
      } else if (rangeSec > 90 * 24 * 3600) {
        // > 3 months
        dateFormat = "MMM YY";
      } else if (rangeSec >= 24 * 3600) {
        // >= 1 day
        dateFormat = "MM/DD HH:mm";
      } else {
        // < 1 day
        dateFormat = "HH:mm";
      }

      const tooltipFormat = "DD MMMM YYYY HH:mm:ss";

      const results: any[] = [];
      const errors: string[] = [];

      for (const query of queries) {
        if (!query.expression.trim()) continue;

        try {
          const params = {
            query: query.expression,
            start: String(startUnix),
            end: String(endUnix),
            step: String(step),
          };

          const res = await apiClient.get<PrometheusResponse>(
            "http://localhost:9090/api/v1/query_range",
            { params }
          );

          const json: PrometheusResponse = res.data;

          // Handle Prometheus API errors
          if (json.status === 'error') {
            const errorMsg = json.error || 'Unknown Prometheus error';
            const errorType = json.errorType || 'unknown';
            errors.push(`Query "${query.expression}": [${errorType}] ${errorMsg}`);
            continue;
          }

          // Check if we have results
          if (!json.data || !json.data.result || json.data.result.length === 0) {
            console.info(`No data returned for query: ${query.expression}`);
            continue;
          }

          const legend = query.legend?.trim();

          // Process each series in the result
          json.data.result.forEach((series: any) => {
            const metric = series.metric;
            const metricName = metric.__name__ || query.expression;
            const metricLabels = Object.entries(metric)
              .filter(([k]) => k !== "__name__")
              .map(([k, v]) => `${k}=${v}`)
              .join(", ");

            const legendName = legend
              ? legend
              : metricLabels
                ? `${metricName} (${metricLabels})`
                : metricName;

            const values = series.values.map(
              ([timestamp, value]: any) => {
                const parsedValue = parseFloat(value);

                // Handle special values
                if (isNaN(parsedValue)) {
                  console.warn(`Invalid value for ${legendName} at ${timestamp}: ${value}`);
                  return {
                    time: moment(timestamp * 1000).format(dateFormat),
                    fullTime: moment(timestamp * 1000).format(tooltipFormat),
                    [legendName]: null,
                  };
                }

                return {
                  time: moment(timestamp * 1000).format(dateFormat),
                  fullTime: moment(timestamp * 1000).format(tooltipFormat),
                  [legendName]: parsedValue,
                };
              }
            );

            results.push({
              name: legendName,
              data: values,
            });
          });

        } catch (queryError: any) {
          // Handle individual query errors (Axios)
          const errorMessage =
            queryError?.response?.data?.error ||
            queryError?.response?.data?.message ||
            queryError?.message ||
            'Unknown error';
          errors.push(`Query "${query.expression}": ${errorMessage}`);
          console.error(`Error fetching query "${query.expression}":`, queryError);
        }
      }

      // If we have errors, dispatch them
      if (errors.length > 0) {
        dispatch(setError(errors));

        // If no results at all, don't proceed
        if (results.length === 0) {
          dispatch(setChartSeries([]));
          dispatch(setMergedData([]));
          dispatch(setLoading(false));
          return;
        }
      }

      // Only proceed if we have results
      if (results.length > 0) {
        dispatch(setChartSeries(results));
        dispatch(setActiveTab("graph"));

        const merged = results[0].data.map((p: any, i: number) => {
          const row: any = {
            time: p.time,
            fullTime: p.fullTime,
          };

          results.forEach((series: any) => {
            row[series.name] = series.data[i]?.[series.name] ?? null;
          });

          return row;
        });

        dispatch(setMergedData(merged));
      } else {
        // No results and no errors means empty queries
        dispatch(setChartSeries([]));
        dispatch(setMergedData([]));
      }

      dispatch(setLoading(false));

    } catch (error: any) {
      // Handle unexpected errors
      const errorMessage = error.message || 'An unexpected error occurred';
      console.error('Unexpected error in fetchPrometheusQueries:', error);
      dispatch(setError([errorMessage]));
      dispatch(setLoading(false));
    }
  };


export const fetchPrometheusTableQueries =
  (queries: Query[], time: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError([]));

      const results: TableRowType[] = [];
      const errors: string[] = [];

      for (const query of queries) {
        if (!query.expression.trim()) continue;

        try {
          const res = await apiClient.get<PrometheusResponse>(
            "http://localhost:9090/api/v1/query",
            { 
              params: {
                query: query.expression,
                time: moment(time).unix() // Current time for instant query
              }
            }
          );

          const json: PrometheusResponse = res.data;

          // Handle Prometheus API errors
          if (json.status === 'error') {
            const errorMsg = json.error || 'Unknown Prometheus error';
            const errorType = json.errorType || 'unknown';
            errors.push(`Query "${query.expression}": [${errorType}] ${errorMsg}`);
            continue;
          }

          // Check if we have results
          if (!json.data || !json.data.result || json.data.result.length === 0) {
            console.info(`No data returned for query: ${query.expression}`);
            continue;
          }

          // Process each result
          json.data.result.forEach((item) => {
            const metric = item.metric;
            const [timestamp, value] = item.value;

            // Extract metric name
            const metricName = metric.__name__ || query.expression;

            // Extract labels (excluding __name__)
            const labels = Object.entries(metric)
              .filter(([k]) => k !== "__name__")
              .reduce((acc, [k, v]) => {
                acc[k] = v;
                return acc;
              }, {} as Record<string, string>);

            // Parse value
            const parsedValue = parseFloat(value);
            const displayValue = isNaN(parsedValue) ? value : parsedValue;

            results.push({
              metric: metricName,
              labels,
              value: displayValue,
              timestamp: moment(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss"),
              query: query.expression
            });
          });

        } catch (queryError: any) {
          const errorMessage =
            queryError?.response?.data?.error ||
            queryError?.response?.data?.message ||
            queryError?.message ||
            'Unknown error';
          errors.push(`Query "${query.expression}": ${errorMessage}`);
          console.error(`Error fetching query "${query.expression}":`, queryError);
        }
      }

      // If we have errors, dispatch them
      if (errors.length > 0) {
        dispatch(setError(errors));

        // If no results at all, don't proceed
        if (results.length === 0) {
          dispatch(setTableData([]));
          dispatch(setLoading(false));
          return;
        }
      }

      // Dispatch results
      if (results.length > 0) {
        dispatch(setTableData(results));
        dispatch(setActiveTab("table"));
      } else {
        dispatch(setTableData([]));
      }

      dispatch(setLoading(false));

    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      console.error('Unexpected error in fetchPrometheusTableQueries:', error);
      dispatch(setError([errorMessage]));
      dispatch(setLoading(false));
    }
  };

  export const fetchPrometheusMetricsOptions = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await apiClient.get("http://localhost:9090/api/v1/label/__name__/values");
    const json = res.data;

    if (json.status === "success") {
      dispatch(setMetricOptions(json.data));
    } else {
      dispatch(setError(["Failed to fetch metrics"]));
    }
  } catch (error: any) {
    console.error("Failed to fetch metrics:", error);
    dispatch(setError([error?.message || "Metrics fetch failed"]));
  } finally {
    dispatch(setLoading(false));
  }
};

  