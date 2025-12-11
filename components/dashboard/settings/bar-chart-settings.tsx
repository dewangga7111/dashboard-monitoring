import { Switch, Divider } from "@heroui/react";
import AppTextInput from "@/components/common/app-text-input";
import { BarChartSettings } from "@/types/dashboard";

interface BarChartSettingsPanelProps {
  settings: BarChartSettings;
  onChange: (settings: BarChartSettings) => void;
}

export default function BarChartSettingsPanel({
  settings,
  onChange,
}: BarChartSettingsPanelProps) {
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

  return (
    <div className="flex gap-6">
      {/* Column 1: Legend & Visual */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <div className="text-sm text-default-500 font-bold">Legend</div>
          <Divider className="w-full my-2" />
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <span className="text-sm">Show</span>
              <Switch
                isSelected={settings.legend.show}
                onValueChange={(v) => updateSetting("legend.show", v)}
                size="sm"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm text-default-500 font-bold">Visual</div>
          <Divider className="w-full my-2" />
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <span className="text-sm">Bar Size</span>
              <AppTextInput
                className="w-40"
                type="number"
                placeholder="Auto"
                value={settings.visual.barSize?.toString() || ""}
                onChange={(e: any) =>
                  updateSetting(
                    "visual.barSize",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Vertical Grid Lines</span>
              <Switch
                isSelected={settings.grid.showVertical}
                onValueChange={(v) => updateSetting("grid.showVertical", v)}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: Axes */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <div className="text-sm text-default-500 font-bold">X Axis</div>
          <Divider className="w-full my-2" />
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <span className="text-sm">Show</span>
              <Switch
                isSelected={settings.xAxis.show}
                onValueChange={(v) => updateSetting("xAxis.show", v)}
                size="sm"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm text-default-500 font-bold">Y Axis</div>
          <Divider className="w-full my-2" />
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <span className="text-sm">Show</span>
              <Switch
                isSelected={settings.yAxis.show}
                onValueChange={(v) => updateSetting("yAxis.show", v)}
                size="sm"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Short Values</span>
              <Switch
                isSelected={settings.yAxis.shortValues}
                onValueChange={(v) => updateSetting("yAxis.shortValues", v)}
                size="sm"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Label</span>
              <AppTextInput
                className="w-40"
                placeholder="Enter label"
                value={settings.yAxis.label || ""}
                onChange={(e: any) =>
                  updateSetting("yAxis.label", e.target.value || undefined)
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Max</span>
              <AppTextInput
                className="w-40"
                type="number"
                placeholder="Auto"
                value={settings.yAxis.max?.toString() || ""}
                onChange={(e: any) =>
                  updateSetting(
                    "yAxis.max",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Min</span>
              <AppTextInput
                className="w-40"
                type="number"
                placeholder="Auto"
                value={settings.yAxis.min?.toString() || ""}
                onChange={(e: any) =>
                  updateSetting(
                    "yAxis.min",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
