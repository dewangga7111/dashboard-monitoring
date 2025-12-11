"use client";

import { Card, CardBody, Alert, Spinner, Tooltip, Button } from "@heroui/react";
import { Info, Trash2, GripVertical } from "lucide-react";
import { VisualizationData, LineChartSettings, AreaChartSettings, BarChartSettings, StatChartSettings, PieChartSettings, GaugeChartSettings } from "@/types/dashboard";
import VizLineChart from "@/components/charts/viz-line-chart";
import VizAreaChart from "@/components/charts/viz-area-chart";
import VizBarChart from "@/components/charts/viz-bar-chart";
import VizStatChart from "@/components/charts/viz-stat-chart";
import VizPieChart from "@/components/charts/viz-pie-chart";
import VizGaugeChart from "../charts/viz-gauge-chart";

interface VisualizationCardProps {
  visualization: VisualizationData;
  editMode: boolean;
  onRemove?: (id: string) => void;
}

export default function VisualizationCard({
  visualization,
  editMode,
  onRemove,
}: VisualizationCardProps) {
  const renderChart = () => {
    // Show loading state
    if (visualization.loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Spinner size="lg" variant="wave" />
        </div>
      );
    }

    // Check if data is available
    if (!visualization.chartData || visualization.chartData.mergedData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          {visualization.queries.length > 0 ? "No data available" : "Add queries to visualize data"}
        </div>
      );
    }

    const { chartSeries, mergedData } = visualization.chartData;

    // Render chart based on visualization type
    switch (visualization.type) {
      case "line":
        return (
          <VizLineChart
            data={mergedData}
            chartSeries={chartSeries}
            loading={visualization.loading}
            settings={visualization.settings as LineChartSettings}
          />
        );

      case "area":
        return (
          <VizAreaChart
            data={mergedData}
            chartSeries={chartSeries}
            loading={visualization.loading}
            settings={visualization.settings as AreaChartSettings}
          />
        );

      case "bar":
        return (
          <VizBarChart
            data={mergedData}
            chartSeries={chartSeries}
            loading={visualization.loading}
            settings={visualization.settings as BarChartSettings}
          />
        );

      case "stat":
        return (
          <VizStatChart
            data={mergedData}
            chartSeries={chartSeries}
            loading={visualization.loading}
            settings={visualization.settings as StatChartSettings}
          />
        );

      case "pie":
        return (
          <VizPieChart
            data={mergedData}
            chartSeries={chartSeries}
            loading={visualization.loading}
            settings={visualization.settings as PieChartSettings}
          />
        );

      case "gauge":
        return (
          <VizGaugeChart
            data={mergedData}
            chartSeries={chartSeries}
            loading={visualization.loading}
            settings={visualization.settings as GaugeChartSettings}
          />
        );

      default:
        return <div>Unsupported visualization type</div>;
    }
  };

  return (
    <Card className="h-full">
      <CardBody className="flex flex-col h-full p-0">
        {/* Header */}
        <div className="relative p-4 pb-2">
          {/* Drag handle for edit mode */}
          {editMode && (
            <div className="drag-handle absolute top-3 left-3 cursor-move">
              <GripVertical size={20} className="text-default-400" />
            </div>
          )}

          {/* Info icon with description tooltip */}
          {visualization.description && (
            <Tooltip
              content={visualization.description}
              placement="top"
              color="foreground"
              closeDelay={0}
              delay={500}
            >
              <Info
                className={`absolute top-3 ${editMode ? "left-10" : "left-3"}`}
                size={18}
              />
            </Tooltip>
          )}

          {/* Remove button for edit mode */}
          {editMode && onRemove && (
            <Button
              isIconOnly
              size="sm"
              color="danger"
              variant="light"
              className="absolute top-2 right-2"
              onPress={() => onRemove(visualization.id)}
            >
              <Trash2 size={16} />
            </Button>
          )}

          {/* Visualization title */}
          <div className="font-semibold text-center">{visualization.name}</div>
        </div>

        {/* Error messages */}
        {visualization.error && visualization.error.length > 0 && (
          <div className="px-4 pb-2">
            {visualization.error.map((error, index) => (
              <Alert
                key={index}
                color="danger"
                title={error}
                variant="flat"
                className="mb-2"
              />
            ))}
          </div>
        )}

        {/* Chart content */}
        <div className="flex-1 px-4 pb-4">
          {renderChart()}
        </div>
      </CardBody>
    </Card>
  );
}