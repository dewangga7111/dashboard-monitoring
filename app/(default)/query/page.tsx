"use client";

import { Alert, Button, Card, CardBody, Select, SelectItem, Spinner, Tab, Tabs, Tooltip } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChartLine, Plus, RefreshCw, Table2, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import DashboardFilter from "@/components/dashboard/filter";
import QueryForm from "@/components/query/query-form";
import QueryTableView from "@/components/query/query-table-view";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrometheusQueries, fetchPrometheusTableQueries } from "@/redux/api/prometheus-api";
import { AppDispatch, RootState } from "@/redux/store";
import { Query } from "@/types/query";
import moment from "moment";
import AppLineChart from "@/components/charts/app-line-chart";

export default function QueryPage() {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.prometheus);

  const [queries, setQueries] = useState<Query[]>([{ id: 1, expression: "", legend: "" }]);
  const [nextId, setNextId] = useState(2);
  const [start, setStart] = useState<string>(moment().subtract(1, "hour").toISOString());
  const [end, setEnd] = useState<string>(moment().toISOString());
  const [refreshInterval, setRefreshInterval] = useState("off");
  const [activeTab, setActiveTab] = useState<"table" | "graph">("graph");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Parse interval string to milliseconds
  const getIntervalMs = (interval: string): number | null => {
    const intervalMap: Record<string, number> = {
      "off": 0,
      "5s": 5000,
      "10s": 10000,
      "15s": 15000,
      "30s": 30000,
      "1m": 60000,
      "5m": 300000,
      "15m": 900000,
    };
    return intervalMap[interval] || null;
  };

  // Execute query fetch based on active tab
  const executeQuery = (updateTimeRange: boolean = false) => {
    const hasValidQuery = queries.some(q => q.expression.trim());
    if (!hasValidQuery) return;

    if (activeTab === "table") {
      // Use instant query for table view
      dispatch(fetchPrometheusTableQueries(queries));
    } else {
      // Use range query for graph view
      let queryStart = start;
      let queryEnd = end;

      // If updating time range, recalculate based on the original duration
      if (updateTimeRange) {
        const duration = moment(end).diff(moment(start));
        queryEnd = moment().toISOString();
        queryStart = moment().subtract(duration, 'milliseconds').toISOString();
        setStart(queryStart);
        setEnd(queryEnd);
      }

      dispatch(fetchPrometheusQueries(queries, queryStart, queryEnd));
    }
  };

  // Setup auto-refresh interval
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const intervalMs = getIntervalMs(refreshInterval);

    // If interval is off or invalid, don't setup
    if (!intervalMs || intervalMs === 0) {
      return;
    }

    // Setup new interval - update time range on auto-refresh
    intervalRef.current = setInterval(() => {
      executeQuery(activeTab === "graph"); // Only update time range for graph view
    }, intervalMs);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval, activeTab]);

  const handleAddQuery = () => {
    setQueries([...queries, { id: nextId, expression: "", legend: "" }]);
    setNextId(nextId + 1);
  };

  const handleRemoveQuery = (id: number) => {
    if (queries.length > 1) {
      setQueries(queries.filter(query => query.id !== id));
    }
  };

  const handleExpressionChange = (id: number, expression: string) => {
    setQueries(prevQueries => prevQueries.map(query =>
      query.id === id ? { ...query, expression } : query
    ));
  };

  const handleLegendChange = (id: number, legend: string) => {
    setQueries(prevQueries => prevQueries.map(query =>
      query.id === id ? { ...query, legend } : query
    ));
  };

  const handleRefreshIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRefreshInterval(e.target.value);
  };

  const handleTabChange = (key: React.Key) => {
    setActiveTab(key as "table" | "graph");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Tabs
          aria-label="Options"
          color="primary"
          variant="solid"
          selectedKey={activeTab}
          onSelectionChange={handleTabChange}
        >
          <Tab
            key="table"
            title={
              <div className="flex items-center space-x-2">
                <Table2 />
                <span>Table</span>
              </div>
            }
          />
          <Tab
            key="graph"
            title={
              <div className="flex items-center space-x-2">
                <ChartLine />
                <span>Graph</span>
              </div>
            }
          />
        </Tabs>
        <div className="flex gap-2 items-center">
          {/* Only show time range filter for graph view */}
          {activeTab === "graph" && (
            <DashboardFilter
              className="w-[350px]"
              value={{ start, end }}
              onChange={(val) => {
                setStart(val?.start || "");
                setEnd(val?.end || "");
              }}
            />
          )}
          <Tooltip
            content="Auto refresh interval"
            placement="bottom"
            showArrow={true}
            color="foreground"
            closeDelay={0}
            delay={500}
            offset={-10}
            crossOffset={15}
            size="sm"
          >
            <Select
              className="w-[80px]"
              items={[
                { key: "off", label: "Off" },
                { key: "5s", label: "5s" },
                { key: "10s", label: "10s" },
                { key: "15s", label: "15s" },
                { key: "30s", label: "30s" },
                { key: "1m", label: "1m" },
                { key: "5m", label: "5m" },
                { key: "15m", label: "15m" },
              ]}
              selectedKeys={[refreshInterval]}
              onChange={handleRefreshIntervalChange}
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>
          </Tooltip>
          <Tooltip
            content="Refresh"
            placement="bottom"
            showArrow={true}
            color="foreground"
            closeDelay={0}
            delay={500}
            size="sm"
          >
            <Button
              isIconOnly
              aria-label="Refresh"
              className="bg-[#F4F4F5]"
              onPress={() => executeQuery()}
            >
              <RefreshCw className="text-gray-500" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {queries.map((query, index) => (
          <motion.div
            key={query.id}
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <QueryForm
                key={`query-form-${query.id}`}
                index={index + 1}
                valueExpression={query.expression}
                onChangeExpression={(expression: string) => handleExpressionChange(query.id, expression)}
                valueLegend={query.legend}
                onChangeLegend={(legend: string) => handleLegendChange(query.id, legend)}
                onSearch={() => executeQuery()}
              />
              {queries.length > 1 && (
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="flat"
                  className="absolute top-2 right-2 z-10"
                  onPress={() => handleRemoveQuery(query.id)}
                  aria-label="Remove query"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        color="primary"
        className="w-full"
        startContent={<Plus size={20} />}
        onPress={handleAddQuery}
      >
        Add Query
      </Button>

      <Card>
        <CardBody>
          {/* Error messages */}
          {store.error.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              {store.error.map((error, index) => (
                <Alert
                  key={index}
                  color="danger"
                  title={error}
                  variant="solid"
                />
              ))}
            </div>
          )}

          {/* Content based on active tab */}
          {activeTab === "table" ? (
            <QueryTableView
              data={store.tableData}
              loading={store.loading}
            />
          ) : (
            store.mergedData.length > 0 ? (
              <AppLineChart
                data={store.mergedData}
                chartSeries={store.chartSeries}
                loading={store.loading}
              />
            ) : (
              store.error.length === 0 && (
                <div className="flex items-center justify-center h-[500px]">
                  {store.loading ? (
                    <Spinner size="lg" />
                  ) : queries.some(q => q.expression) ? (
                    "Query results will appear here"
                  ) : (
                    "No data queried yet"
                  )}
                </div>
              )
            )
          )}
        </CardBody>
      </Card>
    </div>
  );
}