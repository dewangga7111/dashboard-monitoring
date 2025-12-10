import { Alert, Button, Card, CardBody, Drawer, DrawerBody, DrawerContent, DrawerHeader, Spinner, Tab, Tabs, Tooltip } from "@heroui/react";
import AppTextInput from "@/components/common/app-text-input";
import AppAutocomplete from "@/components/common/app-autocomplete";
import VizLineChart from "@/components/charts/viz-line-chart";
import VizAreaChart from "@/components/charts/viz-area-chart";
import VizBarChart from "@/components/charts/viz-bar-chart";
import VizStatChart from "@/components/charts/viz-stat-chart";
import { Query } from "@/types/query";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QueryForm from "../query/query-form";
import { Info, Plus, Trash2 } from "lucide-react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrometheusQueries } from "@/redux/api/prometheus-api";
import { AppDispatch, RootState } from "@/redux/store";
import { inputLabel } from "@/utils/primitives";
import { useConfirmation } from "@/context/confirmation-context";
import constants from "@/utils/constants";
import { clearPrometheus } from "@/redux/slices/prometheus-slice";
import { v4 as uuidv4 } from "uuid";
import { VisualizationData } from "@/types/dashboard";
import VizPieChart from "../charts/viz-pie-chart";
import VizGaugeChart from "../charts/viz-gauge-chart";

interface AddVisualizationDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (visualization: any) => void;
}

const visualizationTypes = [
  { value: "line", label: "Line" },
  { value: "area", label: "Area" },
  { value: "bar", label: "Bar" },
  { value: "stat", label: "Stat/Number" },
  { value: "pie", label: "Pie" },
  { value: "gauge", label: "Gauge" },
];

const start = moment().subtract(1, "hour").toISOString();
const end = moment().toISOString();

export default function AddVisualizationDrawer({
  isOpen,
  onOpenChange,
  onAdd
}: AddVisualizationDrawerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.prometheus);
  const { confirm } = useConfirmation();

  const [queries, setQueries] = useState<Query[]>([{ id: uuidv4(), expression: "", legend: "" }]);
  const [name, setName] = useState("");
  const [type, setType] = useState<"line" | "area" | "bar" | "stat" | "pie" | "gauge">("line");
  const [description, setDescription] = useState("");

  const clearState = () => {
    setQueries([{ id: uuidv4(), expression: "", legend: "" }]);
    setName("");
    setType("line");
    setDescription("");
    dispatch(clearPrometheus());
  };

  useEffect(() => {
    return () => {
      clearState();
    };
  }, [dispatch]);

  const handleAdd = () => {
    if (!name.trim()) {
      alert("Please enter a visualization name");
      return;
    }

    const hasValidQuery = queries.some(q => q.expression.trim());
    if (!hasValidQuery) {
      alert("Please add at least one query");
      return;
    }

    // Collect visualization data and call onAdd
    const data: VisualizationData = {
      id: uuidv4(),
      name: name,
      type: type,
      description: description,
      queries: queries.filter(q => q.expression.trim()), // Only include non-empty queries
      x: 0,
      y: 0,
      width: 6,
      height: 6
    };
    onAdd(data);
    clearState();
    onOpenChange(false);
  };

  const handleClose = () => {
    const hasChanges = name.trim() || description.trim() || queries.some(q => q.expression.trim());

    if (hasChanges) {
      confirm({
        message: constants.confirmation.CLOSE_DRAWER,
        confirmText: "Discard Changes",
        cancelText: "Cancel",
        onConfirm: () => {
          clearState();
          onOpenChange(false);
        },
      });
    } else {
      clearState();
      onOpenChange(false);
    }
  };

  const executeQuery = () => {
    const hasValidQuery = queries.some(q => q.expression.trim());
    if (!hasValidQuery) return;

    dispatch(fetchPrometheusQueries(queries, start, end));
  };

  const handleExpressionChange = (id: string, expression: string) => {
    setQueries(prevQueries => prevQueries.map(query =>
      query.id === id ? { ...query, expression } : query
    ));
  };

  const handleLegendChange = (id: string, legend: string) => {
    setQueries(prevQueries => prevQueries.map(query =>
      query.id === id ? { ...query, legend } : query
    ));
  };

  const handleAddQuery = () => {
    setQueries([...queries, { id: uuidv4(), expression: "", legend: "" }]);
  };

  const handleRemoveQuery = (id: string) => {
    if (queries.length > 1) {
      setQueries(queries.filter(query => query.id !== id));
    }
  };

  const renderPreviewChart = () => {
    if (store.loading) {
      return (
        <div className="flex items-center justify-center h-[300px]">
          <Spinner size="lg" variant="wave" />
        </div>
      );
    }

    if (store.error.length > 0) {
      return null; // Errors are shown above the chart
    }

    if (store.mergedData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px]">
          {queries.some(q => q.expression) ? (
            "Query results will appear here"
          ) : (
            "No data queried yet"
          )}
        </div>
      );
    }

    // Render chart based on selected type
    const chartProps = {
      data: store.mergedData,
      chartSeries: store.chartSeries,
      loading: store.loading
    };

    switch (type) {
      case "line":
        return (
          <div className="h-[300px]">
            <VizLineChart {...chartProps} />
          </div>
        );
      case "area":
        return (
          <div className="h-[300px]">
            <VizAreaChart {...chartProps} />
          </div>
        );
      case "bar":
        return (
          <div className="h-[300px]">
            <VizBarChart {...chartProps} />
          </div>
        );
      case "gauge":
        return (
          <div className="h-[300px]">
            <VizGaugeChart {...chartProps} />
          </div>
        );
      case "stat":
        return (
          <div className="h-[300px]">
            <VizStatChart {...chartProps} />
          </div>
        );
      case "pie":
        return (
          <div className="h-[300px]">
            <VizPieChart {...chartProps} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      backdrop="blur"
      hideCloseButton
    >
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
              Add Visualization
              <div className="flex gap-2">
                <Button color="default" variant="flat" size="sm" onPress={handleClose}>
                  Close
                </Button>
                <Button color="primary" size="sm" onPress={handleAdd}>
                  Add
                </Button>
              </div>
            </DrawerHeader>
            <DrawerBody className="pt-16 pb-8 flex flex-col gap-4">
              {/* Visualization Settings */}
              <div className="flex gap-2">
                <AppTextInput
                  label="Name"
                  placeholder="Enter visualization name"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                  isRequired
                />
                <AppAutocomplete
                  items={visualizationTypes}
                  label="Visualization Type"
                  selectedKey={type}
                  onSelectionChange={(v: any) => setType(v)}
                  isRequired
                />
              </div>
              <AppTextInput
                label="Description"
                placeholder="Optional description for this visualization"
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
              />

              {/* Preview Card */}
              <div>
                <span className={inputLabel()}>Preview</span>
                <Card className="mt-2">
                  <CardBody>
                    {/* Info icon */}
                    {description && (
                      <Tooltip
                        content={description}
                        placement="top"
                        color="foreground"
                        closeDelay={0}
                        delay={500}
                      >
                        <Info className="absolute top-3 left-3" size={18} />
                      </Tooltip>
                    )}

                    {/* Title */}
                    <div className="font-semibold text-center mb-5">
                      {name || "Untitled Visualization"}
                    </div>

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

                    {/* Chart Preview */}
                    {renderPreviewChart()}
                  </CardBody>
                </Card>
              </div>

              {/* Query Forms */}
              {/* <Tabs
                aria-label="Options"
                color="primary"
                variant="solid"
                classNames={{
                  tabContent: "text-content1-foreground",
                  tab: "data-[selected=true]:bg-primary data-[selected=true]:text-white"
                }}
              >
                <Tab
                  key="query"
                  title={
                    <div className="flex items-center space-x-2">
                      <span>Query</span>
                    </div>
                  }
                />
                <Tab
                  key="settings"
                  title={
                    <div className="flex items-center space-x-2">
                      <span>Settings</span>
                    </div>
                  }
                />
              </Tabs> */}
              <div>
                <span className={inputLabel()}>Queries</span>
                <div className="mt-2">
                  <AnimatePresence mode="popLayout">
                    {queries.map((query, index) => (
                      <motion.div
                        key={query.id}
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
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
                </div>
              </div>

              {/* Add Query Button */}
              <div className="h-[100%]">
                <Button
                  color="primary"
                  className="w-full"
                  startContent={<Plus size={20} />}
                  onPress={handleAddQuery}
                >
                  Add Query
                </Button>
              </div>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}