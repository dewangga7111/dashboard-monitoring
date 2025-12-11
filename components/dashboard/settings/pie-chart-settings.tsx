import { Switch, Divider } from "@heroui/react";
import AppTextInput from "@/components/common/app-text-input";
import AppAutocomplete from "@/components/common/app-autocomplete";
import { PieChartSettings } from "@/types/dashboard";

interface PieChartSettingsPanelProps {
  settings: PieChartSettings;
  onChange: (settings: PieChartSettings) => void;
}

const labelTypeOptions = [
  { value: "value", label: "Value" },
  { value: "percentage", label: "Percentage" },
  { value: "name", label: "Name" },
];

export default function PieChartSettingsPanel({
  settings,
  onChange,
}: PieChartSettingsPanelProps) {
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
              <span className="text-sm">Outer Radius</span>
              <AppTextInput
                className="w-40"
                placeholder="e.g., 80%"
                value={settings.visual.outerRadius}
                onChange={(e: any) =>
                  updateSetting("visual.outerRadius", e.target.value)
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Inner Radius (Donut)</span>
              <AppTextInput
                className="w-40"
                placeholder="e.g., 40%"
                value={settings.visual.innerRadius || ""}
                onChange={(e: any) =>
                  updateSetting(
                    "visual.innerRadius",
                    e.target.value || undefined
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

            <AppAutocomplete
              label="Label Type"
              items={labelTypeOptions}
              selectedKey={settings.visual.labelType}
              onSelectionChange={(v) => updateSetting("visual.labelType", v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
