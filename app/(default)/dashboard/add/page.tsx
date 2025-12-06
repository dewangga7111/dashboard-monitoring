"use client";

import { Button, Divider, Form, Tooltip } from "@heroui/react";
import { Save, Plus, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppTextInput from "@/components/common/app-text-input";
import { showErrorToast, showSuccessToast } from "@/utils/common";
import { useConfirmation } from "@/context/confirmation-context";
import { AppDispatch, RootState } from "@/redux/store";
import { actionButtons } from "@/utils/primitives";
import constants from "@/utils/constants";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DashboardFilterDateRange from "@/components/dashboard/filter-date-range";
import moment from "moment";
import DashboardAutoRefresh from "@/components/dashboard/filter-auto-refresh";
import AddVisualizationDrawer from "@/components/dashboard/add-visualization-drawer";
import VisualizationCard from "@/components/dashboard/visualization-card";
import { VisualizationData } from "@/types/dashboard";
import {
  addVisualization,
  removeVisualization,
  updateVisualizationLayout,
  setVisualizations,
} from "@/redux/slices/dashboard-visualization-slice";
import {
  fetchVisualizationData,
  fetchAllVisualizationsData,
} from "@/redux/api/dashboard-visualization-api";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.dashboardVisualization);
  const { confirm } = useConfirmation();
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [gridWidth, setGridWidth] = useState(1200);
  const [editMode, setEditMode] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [tempVisualizations, setTempVisualizations] = useState<VisualizationData[]>([]);
  const [start, setStart] = useState<string>(
    moment().subtract(1, "hour").toISOString()
  );
  const [end, setEnd] = useState<string>(moment().toISOString());
  const [refreshInterval, setRefreshInterval] = useState("off");
  const [dashboardName, setDashboardName] = useState("My Dashboard");
  const [tempDashboardName, setTempDashboardName] = useState("");

  // Update grid width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setGridWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateWidth);
      resizeObserver.disconnect();
    };
  }, []);

  // Fetch data for all visualizations when time range changes and visualizations are changed
  useEffect(() => {
    if (store.visualizations.length > 0) {
      dispatch(fetchAllVisualizationsData(store.visualizations, start, end));
    }
  }, [start, end, store.visualizations.length]);

  // Setup auto-refresh interval
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const getIntervalMs = (interval: string): number | null => {
      const intervalMap: Record<string, number> = {
        off: 0,
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

    const intervalMs = getIntervalMs(refreshInterval);

    if (!intervalMs || intervalMs === 0) {
      return;
    }

    intervalRef.current = setInterval(() => {
      // Update time range
      const duration = moment(end).diff(moment(start));
      const queryEnd = moment().toISOString();
      const queryStart = moment()
        .subtract(duration, "milliseconds")
        .toISOString();
      setStart(queryStart);
      setEnd(queryEnd);
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  const handleCancel = () => {
    confirm({
      message: constants.confirmation.CLOSE_DRAWER,
      confirmText: "Discard Changes",
      cancelText: "Cancel",
      onConfirm: () => {
        setDashboardName(tempDashboardName);
        dispatch(setVisualizations(tempVisualizations));
        setEditMode(false)
        setTempVisualizations([]);
        setTempDashboardName("");
      },
    });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    confirm({
      message: constants.confirmation.SAVE,
      onConfirm: () => {
        doSave();
      },
    });
  };

  const doSave = () => {
    // Save dashboard to backend
    const data = {
      name: dashboardName,
      visualizations: store.visualizations.map((v) => ({
        id: v.id,
        name: v.name,
        type: v.type,
        description: v.description,
        queries: v.queries,
        x: v.x,
        y: v.y,
        width: v.width,
        height: v.height,
      })),
    }
    console.log(data);
    showSuccessToast(constants.toast.SUCCESS_SAVE);
    setEditMode(false);
  };

  const handleLayoutChange = (layout: any) => {
    layout.forEach((item: any) => {
      dispatch(
        updateVisualizationLayout({
          id: item.i,
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
        })
      );
    });
  };

  const handleAddVisualization = (visualization: VisualizationData) => {
    dispatch(addVisualization(visualization));
    // Fetch data for the new visualization
    dispatch(fetchVisualizationData(visualization, start, end));
  };

  const handleRemoveVisualization = (id: string) => {
    confirm({
      message: "Are you sure you want to remove this visualization?",
      onConfirm: () => {
        dispatch(removeVisualization(id));
      },
    });
  };

  const handleRefresh = () => {
    dispatch(fetchAllVisualizationsData(store.visualizations, start, end));
  };

  return (
    <div>
      <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {editMode && (
          <>
            <div className="flex justify-end items-end w-full">
              <div className={actionButtons()}>
                <Button
                  color="primary"
                  variant="light"
                  size="sm"
                  onPress={() => setOpenDrawer(true)}
                  startContent={<Plus size={18} />}
                >
                  Add Visualization
                </Button>
                <Button
                  color="default"
                  variant="flat"
                  size="sm"
                  onPress={() => handleCancel()}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  size="sm"
                  startContent={<Save size={18} />}
                >
                  Save
                </Button>
              </div>
            </div>
            <div className="w-full">
              <Divider />
            </div>
          </>
        )}

        <div className="flex gap-2 justify-between items-center w-full">
          {editMode ? (
            <AppTextInput
              className="w-[30%]"
              placeholder="Dashboard Name"
              value={dashboardName}
              onChange={(e: any) => setDashboardName(e.target.value)}
            />
          ) : (
            <span className="w-[30%] text-lg font-semibold">
              {dashboardName}
            </span>
          )}
          <div className="flex gap-2">
            <DashboardFilterDateRange
              value={{ start, end }}
              onChange={(val) => {
                setStart(val?.start || "");
                setEnd(val?.end || "");
              }}
            />
            <DashboardAutoRefresh
              refreshInterval={refreshInterval}
              onIntervalChange={(interval: string) =>
                setRefreshInterval(interval)
              }
              onRefresh={handleRefresh}
            />
            {!editMode && (
              <Tooltip
                content="Edit Dashboard"
                placement="bottom"
                color="foreground"
                closeDelay={0}
                delay={500}
                size="sm"
              >
                <Button
                  isIconOnly
                  aria-label="Edit"
                  color="primary"
                  size="sm"
                  onPress={() => {
                    setTempDashboardName(dashboardName);
                    setTempVisualizations(store.visualizations)
                    setEditMode(true);
                  }}
                >
                  <Pencil size={18} />
                </Button>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="w-full">
          <Divider />
        </div>

        <div ref={containerRef} className="w-full">
          {store.visualizations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-default-300 rounded-lg">
              <p className="text-default-500 mb-4">
                No visualizations yet. Add one to get started!
              </p>
              <Button
                color="primary"
                onPress={() => {
                  setEditMode(true);
                  setOpenDrawer(true);
                }}
                startContent={<Plus size={18} />}
                variant="bordered"
              >
                Add Visualization
              </Button>
            </div>
          ) : (
            <GridLayout
              className="layout"
              cols={12}
              rowHeight={40}
              width={gridWidth}
              onLayoutChange={handleLayoutChange}
              draggableHandle=".drag-handle"
              containerPadding={[0, 0]}
              margin={[16, 16]}
              autoSize
              isDraggable={editMode}
              isResizable={editMode}
            >
              {store.visualizations.map((viz) => (
                <div
                  key={viz.id}
                  data-grid={{
                    x: viz.x,
                    y: viz.y,
                    w: viz.width,
                    h: viz.height,
                    minW: 3,
                    minH: 4,
                  }}
                >
                  <VisualizationCard
                    visualization={viz}
                    editMode={editMode}
                    onRemove={handleRemoveVisualization}
                  />
                </div>
              ))}
            </GridLayout>
          )}
        </div>
      </Form>

      {/* Add Visualization Drawer */}
      <AddVisualizationDrawer
        isOpen={openDrawer}
        onOpenChange={setOpenDrawer}
        onAdd={handleAddVisualization}
      />
    </div>
  );
}