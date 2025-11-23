"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Filter from "@/components/common/filter";
import { RootState } from "@/redux/store";
import { FilterField } from "@/types/filter";
import AppLineChart from "@/components/charts/app-line-chart";
import { Button, Card, CardBody, Listbox, ListboxItem, ScrollShadow } from "@heroui/react";
import { dummyLogsJson } from "@/dummy/logs";
import { Copy, EllipsisVertical, RefreshCw } from "lucide-react";
import moment from "moment";
import { ManagedPopover } from "@/components/common/managed-popover";
import AppTextInput from "@/components/common/app-text-input";
import AppBarChart from "@/components/charts/app-bar-chart";

export default function EditPermissionPage() {
  const router = useRouter();
  const store = useSelector((state: RootState) => state.roles);

  const fields: FilterField[] = [
    {
      type: "autocomplete",
      key: "log_level",
      label: "Log Level",
      options: [
        { label: "Debug", value: "debug" },
        { label: "Info", value: "info" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" }
      ]
    },
    { type: "daterange", key: "date", label: "Date" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Filter
        fields={fields}
        onFilter={(data) => {
        }}
        onClear={() => {
        }}
      />
      <AppBarChart
        title="Logs Volume"
        data={loadAverageData}
        height={200}
        stacked={true}
      />
      <div className="flex justify-between items-center">
        <AppTextInput
          placeholder="Search logs..."
          className="w-sm"
        />
        <Button
          className="h-6"
          variant="light"
          size="sm"
          isIconOnly
        >
          <RefreshCw size={15} />
        </Button>
      </div>
      <div className="grid">
        <Card className="col-span-5 h-full pr-2 bg-[#18181B] text-white">
          <CardBody>
            <ScrollShadow size={30}>
              {dummyLogsJson.map((data: any, index: number) => (
                <div className="flex items-center gap-2 whitespace-nowrap text-sm" key={index}>
                  <div>
                    <ManagedPopover
                      placement="right"
                      trigger={
                        <Button
                          className="h-6"
                          variant="light"
                          size="sm"
                          isIconOnly
                        >
                          <EllipsisVertical size={15} color="white" />
                        </Button>
                      }
                    >
                      <Listbox variant="flat">
                        <ListboxItem
                          startContent={<Copy size={13} />}
                          onPress={() => {
                          }}
                        >
                          Copy log
                        </ListboxItem>
                      </Listbox>
                    </ManagedPopover>
                  </div>
                  <div>{moment(data.date).format("YYYY-MM-DD HH:mm:ss")}</div>
                  <div
                    className={
                      data.level == "INFO" ? 'text-success' :
                        data.level == "WARNING" ? 'text-warning' :
                          data.level == "ERROR" ? 'text-danger' :
                            data.level == "DEBUG" ? 'text-info' :
                              'text-primary'
                    }
                  >
                    <span className="font-semibold">{data.level}</span>
                  </div>
                  <div>{data.line}</div>
                </div>
              ))}
            </ScrollShadow>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

const loadAverageData = {
  labels: ['08:00', '08:05', '08:10', '08:15', '08:20', '08:25', '08:30', '08:35'],
  datasets: [
    {
      label: 'info',
      data: [0, 15, 30, 25, 45, 60, 55, 40],
      borderColor: '#22c55e'
    },
    {
      label: 'debug',
      data: [10, 25, 20, 35, 50, 45, 65, 55],
      borderColor: '#3b82f6'
    },
    {
      label: 'warn',
      data: [5, 20, 25, 30, 40, 50, 60, 50],
      borderColor: '#f59e0b'
    },
    {
      label: 'error',
      data: [0, 15, 30, 25, 45, 60, 55, 40],
      borderColor: '#ef4444'
    }
  ]
};
