"use client";

import { Button, Select, SelectItem, Tooltip } from "@heroui/react";
import { RefreshCw } from "lucide-react";

interface AutoRefreshControlsProps {
  refreshInterval: string;
  onIntervalChange: (interval: string) => void;
  onRefresh: () => void;
}

export default function DashboardAutoRefresh({
  refreshInterval,
  onIntervalChange,
  onRefresh,
}: AutoRefreshControlsProps) {
  return (
    <div className="flex gap-2">
      <Tooltip
        content="Auto refresh interval"
        placement="bottom"
        color="foreground"
        closeDelay={0}
        delay={500}
        size="sm"
      >
        <Select
          className="w-[80px]"
          size="sm"
          selectedKeys={[refreshInterval]}
          onChange={(e) => onIntervalChange(e.target.value)}
        >
          {[
            { key: "off", label: "Off" },
            { key: "5s", label: "5s" },
            { key: "10s", label: "10s" },
            { key: "15s", label: "15s" },
            { key: "30s", label: "30s" },
            { key: "1m", label: "1m" },
            { key: "5m", label: "5m" },
            { key: "15m", label: "15m" },
          ].map((item) => (
            <SelectItem key={item.key}>{item.label}</SelectItem>
          ))}
        </Select>
      </Tooltip>

      <Tooltip
        content="Refresh"
        placement="bottom"
        color="foreground"
        closeDelay={0}
        delay={500}
        size="sm"
      >
        <Button
          isIconOnly
          aria-label="Refresh"
          className="bg-[#F4F4F5]"
          size="sm"
          onPress={onRefresh}
        >
          <RefreshCw className="text-gray-500" size={18} />
        </Button>
      </Tooltip>
    </div>
  );
}
