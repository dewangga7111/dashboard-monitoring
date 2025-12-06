// redux/api/dashboard-api.ts
import { AppDispatch } from "@/redux/store";
import {
  setVisualizationLoading,
  setVisualizationError,
  updateVisualizationData,
} from "@/redux/slices/dashboard-visualization-slice";
import { VisualizationData } from "@/types/dashboard";
import moment from "moment";
import { apiClient } from "./api-client";
import { PrometheusResponse } from "@/types/prometheus";

export const fetchVisualizationData =
  (visualization: VisualizationData, start: string, end: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(
        setVisualizationLoading({ id: visualization.id, loading: true })
      );
      dispatch(setVisualizationError({ id: visualization.id, error: [] }));

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

      // Determine date format
      let dateFormat: string;
      if (step < 60) {
        dateFormat = "HH:mm:ss";
      } else if (rangeSec > 90 * 24 * 3600) {
        dateFormat = "MMM YY";
      } else if (rangeSec >= 24 * 3600) {
        dateFormat = "MM/DD HH:mm";
      } else {
        dateFormat = "HH:mm";
      }

      const tooltipFormat = "DD MMMM YYYY HH:mm:ss";

      const results: any[] = [];
      const errors: string[] = [];

      // Fetch data for each query in this visualization
      for (const query of visualization.queries) {
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
          if (json.status === "error") {
            const errorMsg = json.error || "Unknown Prometheus error";
            const errorType = json.errorType || "unknown";
            errors.push(
              `Query "${query.expression}": [${errorType}] ${errorMsg}`
            );
            continue;
          }

          // Check if we have results
          if (
            !json.data ||
            !json.data.result ||
            json.data.result.length === 0
          ) {
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

            const values = series.values.map(([timestamp, value]: any) => {
              const parsedValue = parseFloat(value);

              if (isNaN(parsedValue)) {
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
            });

            results.push({
              name: legendName,
              data: values,
            });
          });
        } catch (queryError: any) {
          const errorMessage =
            queryError?.response?.data?.error ||
            queryError?.response?.data?.message ||
            queryError?.message ||
            "Unknown error";
          errors.push(`Query "${query.expression}": ${errorMessage}`);
          console.error(
            `Error fetching query "${query.expression}":`,
            queryError
          );
        }
      }

      // If we have errors, dispatch them
      if (errors.length > 0) {
        dispatch(setVisualizationError({ id: visualization.id, error: errors }));

        // If no results at all, don't proceed
        if (results.length === 0) {
          dispatch(
            setVisualizationLoading({ id: visualization.id, loading: false })
          );
          return;
        }
      }

      // Only proceed if we have results
      if (results.length > 0) {
        const merged =
          results[0].data.map((p: any, i: number) => {
            const row: any = {
              time: p.time,
              fullTime: p.fullTime,
            };

            results.forEach((series: any) => {
              row[series.name] = series.data[i]?.[series.name] ?? null;
            });

            return row;
          }) || [];

        dispatch(
          updateVisualizationData({
            id: visualization.id,
            chartData: {
              chartSeries: results,
              mergedData: merged,
            },
          })
        );
      } else {
        dispatch(
          updateVisualizationData({
            id: visualization.id,
            chartData: {
              chartSeries: [],
              mergedData: [],
            },
          })
        );
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
      console.error(
        `Unexpected error in fetchVisualizationData for ${visualization.id}:`,
        error
      );
      dispatch(
        setVisualizationError({ id: visualization.id, error: [errorMessage] })
      );
    }
  };

// Fetch data for all visualizations
export const fetchAllVisualizationsData =
  (visualizations: VisualizationData[], start: string, end: string) =>
  async (dispatch: AppDispatch) => {
    // Fetch data for each visualization in parallel
    const promises = visualizations.map((viz) =>
      dispatch(fetchVisualizationData(viz, start, end))
    );

    await Promise.all(promises);
  };