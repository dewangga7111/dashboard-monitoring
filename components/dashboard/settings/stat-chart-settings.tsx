import { Switch, Slider, Divider } from "@heroui/react";
import { StatChartSettings } from "@/types/dashboard";

interface StatChartSettingsPanelProps {
  settings: StatChartSettings;
  onChange: (settings: StatChartSettings) => void;
}

export default function StatChartSettingsPanel({
  settings,
  onChange,
}: StatChartSettingsPanelProps) {
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
      {/* Display Settings */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <div className="text-sm text-default-500 font-bold">Display</div>
          <Divider className="w-full my-2" />
          <div className="flex flex-col gap-5">
            <Slider
              label="Decimal Places"
              className="max-w-md"
              color="primary"
              value={settings.display.decimalPlaces}
              onChange={(v) => updateSetting("display.decimalPlaces", Number(v))}
              maxValue={5}
              minValue={0}
              showSteps={true}
              size="md"
              step={1}
            />

            <div className="flex justify-between items-center">
              <span className="text-sm">Show Label</span>
              <Switch
                isSelected={settings.display.showLabel}
                onValueChange={(v) => updateSetting("display.showLabel", v)}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Misc Settings */}
        <div>
          <div className="text-sm text-default-500 font-bold">Misc</div>
          <Divider className="w-full my-2" />
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <span className="text-sm">Sparkline</span>
              <Switch
                isSelected={settings.sparkline?.show ?? false}
                onValueChange={(v) => updateSetting("sparkline.show", v)}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
