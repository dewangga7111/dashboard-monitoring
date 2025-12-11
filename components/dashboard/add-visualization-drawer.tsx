import { Alert, Button, Card, CardBody, Divider, Drawer, DrawerBody, DrawerContent, DrawerHeader, Slider, Spinner, Switch, Tab, Tabs, Tooltip } from "@heroui/react";
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
import { VisualizationData, ChartSettings, LineChartSettings, AreaChartSettings, BarChartSettings, StatChartSettings, PieChartSettings, GaugeChartSettings } from "@/types/dashboard";
import VizPieChart from "../charts/viz-pie-chart";
import VizGaugeChart from "../charts/viz-gauge-chart";
import { getDefaultChartSettings } from "@/utils/chart-defaults";
import LineChartSettingsPanel from "./settings/line-chart-settings";
import AreaChartSettingsPanel from "./settings/area-chart-settings";
import BarChartSettingsPanel from "./settings/bar-chart-settings";
import StatChartSettingsPanel from "./settings/stat-chart-settings";
import PieChartSettingsPanel from "./settings/pie-chart-settings";
import GaugeChartSettingsPanel from "./settings/gauge-chart-settings";

interface AddVisualizationDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (visualization: any) => void;
  editingVisualization?: VisualizationData | null;
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
  onAdd,
  editingVisualization
}: AddVisualizationDrawerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.prometheus);
  const { confirm } = useConfirmation();

  const [queries, setQueries] = useState<Query[]>([{ id: uuidv4(), expression: "", legend: "" }]);
  const [name, setName] = useState("");
  const [type, setType] = useState<"line" | "area" | "bar" | "stat" | "pie" | "gauge">("line");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState<"query" | "settings">("query");
  const [settings, setSettings] = useState<ChartSettings>(getDefaultChartSettings("line"));

  const clearState = () => {
    setQueries([{ id: uuidv4(), expression: "", legend: "" }]);
    setName("");
    setType("line");
    setDescription("");
    setSettings(getDefaultChartSettings("line"));
    setActiveTab("query");
    dispatch(clearPrometheus());
  };

  // Initialize settings when chart type changes
  useEffect(() => {
    setSettings(getDefaultChartSettings(type));
  }, [type]);

  // Load editing visualization data when in edit mode
  useEffect(() => {
    if (editingVisualization && isOpen) {
      setName(editingVisualization.name);
      setType(editingVisualization.type);
      setDescription(editingVisualization.description || "");
      setQueries(editingVisualization.queries.length > 0
        ? editingVisualization.queries
        : [{ id: uuidv4(), expression: "", legend: "" }]);
      setSettings(editingVisualization.settings || getDefaultChartSettings(editingVisualization.type));

      // Execute queries to load data
      if (editingVisualization.queries.length > 0) {
        dispatch(fetchPrometheusQueries(editingVisualization.queries, start, end));
      }
    }
  }, [editingVisualization, isOpen, dispatch]);

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
      id: editingVisualization?.id || uuidv4(),
      name: name,
      type: type,
      description: description,
      queries: queries.filter(q => q.expression.trim()), // Only include non-empty queries
      settings: settings, // Include settings
      x: editingVisualization?.x || 0,
      y: editingVisualization?.y || 0,
      width: editingVisualization?.width || 6,
      height: editingVisualization?.height || 6
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
    // Make sure settings type matches chart type
    const chartSettings = settings?.type === type ? settings : getDefaultChartSettings(type);

    const baseProps = {
      data: store.mergedData,
      chartSeries: store.chartSeries,
      loading: store.loading,
    };

    switch (type) {
      case "line":
        return (
          <div className="h-[300px]">
            <VizLineChart {...baseProps} settings={chartSettings as LineChartSettings} />
          </div>
        );
      case "area":
        return (
          <div className="h-[300px]">
            <VizAreaChart {...baseProps} settings={chartSettings as AreaChartSettings} />
          </div>
        );
      case "bar":
        return (
          <div className="h-[300px]">
            <VizBarChart {...baseProps} settings={chartSettings as BarChartSettings} />
          </div>
        );
      case "gauge":
        return (
          <div className="h-[300px]">
            <VizGaugeChart {...baseProps} settings={chartSettings as GaugeChartSettings} />
          </div>
        );
      case "stat":
        return (
          <div className="h-[300px]">
            <VizStatChart {...baseProps} settings={chartSettings as StatChartSettings} />
          </div>
        );
      case "pie":
        return (
          <div className="h-[300px]">
            <VizPieChart {...baseProps} settings={chartSettings as PieChartSettings} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer
      key={`drawer-${isOpen}`}
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
              {editingVisualization ? "Edit Visualization" : "Add Visualization"}
              <div className="flex gap-2">
                <Button color="default" variant="flat" size="sm" onPress={handleClose}>
                  Close
                </Button>
                <Button color="primary" size="sm" onPress={handleAdd}>
                  {editingVisualization ? "Update" : "Add"}
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
              <Tabs
                aria-label="Options"
                color="primary"
                variant="underlined"
                selectedKey={activeTab}
                onSelectionChange={(key: React.Key) => {
                  setActiveTab(key as "query" | "settings");
                }}
                disableAnimation
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
              </Tabs>
              {activeTab == 'query' &&
                <>
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
                </>
              }
              {activeTab == 'settings' && settings && (
                <div className="flex gap-6">
                  <div className="flex-1">
                    {type === "line" && settings.type === "line" && (
                      <LineChartSettingsPanel
                        settings={settings as LineChartSettings}
                        onChange={setSettings}
                      />
                    )}
                    {type === "area" && settings.type === "area" && (
                      <AreaChartSettingsPanel
                        settings={settings as AreaChartSettings}
                        onChange={setSettings}
                      />
                    )}
                    {type === "bar" && settings.type === "bar" && (
                      <BarChartSettingsPanel
                        settings={settings as BarChartSettings}
                        onChange={setSettings}
                      />
                    )}
                    {type === "stat" && settings.type === "stat" && (
                      <StatChartSettingsPanel
                        settings={settings as StatChartSettings}
                        onChange={setSettings}
                      />
                    )}
                    {type === "pie" && settings.type === "pie" && (
                      <PieChartSettingsPanel
                        settings={settings as PieChartSettings}
                        onChange={setSettings}
                      />
                    )}
                    {type === "gauge" && settings.type === "gauge" && (
                      <GaugeChartSettingsPanel
                        settings={settings as GaugeChartSettings}
                        onChange={setSettings}
                      />
                    )}
                  </div>

                  {/* Reset button column */}
                  <div className="w-48 flex flex-col gap-4">
                    <div>
                      <div className="text-sm text-default-500 font-bold">Reset Settings</div>
                      <Divider className="w-full my-2" />
                      <div className="flex flex-col gap-5">
                        <Button
                          size="sm"
                          variant="bordered"
                          onPress={() => setSettings(getDefaultChartSettings(type))}
                        >
                          Reset to default
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}