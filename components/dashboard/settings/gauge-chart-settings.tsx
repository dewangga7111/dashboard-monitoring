import { Switch, Divider } from "@heroui/react";
import AppTextInput from "@/components/common/app-text-input";
import { GaugeChartSettings } from "@/types/dashboard";
import { useState } from "react";

interface GaugeChartSettingsPanelProps {
  settings: GaugeChartSettings;
  onChange: (settings: GaugeChartSettings) => void;
}

export default function GaugeChartSettingsPanel({
  settings,
  onChange,
}: GaugeChartSettingsPanelProps) {
  const updateSetting = (path: string, value: any) => {
    const keys = path.split(".");
    const newSettings = { ...settings };
    let current: any = newSettings;

    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    onChange(newSettings);
  };

  const updateThreshold = (index: number, value: number) => {
    const newThresholds = [...settings.visual.thresholds];
    newThresholds[index] = value;
    updateSetting("visual.thresholds", newThresholds);
  };

  const updateColor = (index: number, value: string) => {
    const newColors = [...settings.visual.colors];
    newColors[index] = value;
    updateSetting("visual.colors", newColors);
  };

  return (
    <div className="flex gap-6">
      {/* Column 1: Visual Settings */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <div className="text-sm text-default-500 font-bold">Visual</div>
          <Divider className="w-full my-2" />
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <span className="text-sm">Max Value</span>
              <AppTextInput
                className="w-40"
                type="number"
                placeholder="Auto"
                value={settings.visual.max?.toString() || ""}
                onChange={(e: any) =>
                  updateSetting(
                    "visual.max",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Show Labels</span>
              <Switch
                isSelected={settings.visual.showLabels}
                onValueChange={(v) => updateSetting("visual.showLabels", v)}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: Thresholds & Colors */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <div className="text-sm text-default-500 font-bold">
            Thresholds & Colors
          </div>
          <Divider className="w-full my-2" />
          <div className="flex flex-col gap-3">
            {settings.visual.thresholds.map((threshold, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-sm w-16">Level {index + 1}</span>
                <AppTextInput
                  className="w-24"
                  type="number"
                  placeholder="Threshold"
                  value={threshold.toString()}
                  onChange={(e: any) =>
                    updateThreshold(index, parseFloat(e.target.value) || 0)
                  }
                />
                <input
                  type="color"
                  value={settings.visual.colors[index]}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="w-12 h-8 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
