"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { Button, Card, CardBody, Divider, Listbox, ListboxItem, ScrollShadow, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { dummyLogs, dummyLogsJson } from "@/dummy/logs";
import VizLineChart from "@/components/charts/viz-line-chart";
import { useMemo } from "react";
import { formatK } from "@/utils/common";
import { Copy, EllipsisVertical, Pencil, PlusIcon, Trash2 } from "lucide-react";
import moment from "moment";
import AppPagination from "@/components/common/app-pagination";
import { button } from "@/utils/primitives";
import Filter from "@/components/common/filter";
import { FilterField } from "@/types/filter";
import constants from "@/utils/constants";
import { ManagedPopover } from "@/components/common/managed-popover";

export default function LogsPage() {
  const router = useRouter();
  const store = useSelector((state: RootState) => state.logs);

  const fields: FilterField[] = [
    { type: "input", key: "service_name", label: "Service Name" },
  ];

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider", "py-1", "h-5"],
      td: ["text-tiny", "py-1"],
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <Filter
        fields={fields}
        onFilter={(data) => {
        }}
        onClear={() => {
        }}
      />
      <div className="flex justify-end gap-3 items-end">
        <Button onPress={() => { router.push(`${constants.path.LOGS}/add`) }} color="primary" startContent={<PlusIcon />}>
          Add Service
        </Button>
      </div>
      {dummyLogs.map((data) => (
        <div className="grid lg:grid-cols-7 gap-4 w-full h-[250px]" key={data.id}>
          <Card className="col-span-2 h-full">
            <CardBody>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <ManagedPopover
                    placement="right"
                    trigger={
                      <Button
                        variant="light"
                        size="sm"
                        isIconOnly
                      >
                        <EllipsisVertical size={18} />
                      </Button>
                    }
                  >
                    <Listbox aria-label="User actions" variant="flat">
                      <ListboxItem
                        key="edit"
                        startContent={<Pencil size={13} />}
                        onPress={() => {
                        }}
                      >
                        Edit
                      </ListboxItem>
                      <ListboxItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        startContent={<Trash2 size={13} />}
                        onPress={() => {
                        }}
                      >
                        Delete
                      </ListboxItem>
                    </Listbox>
                  </ManagedPopover>
                  <span className="text-sm font-semibold ml-2">{data.service_name}</span>
                </div>
                <Button size="sm" variant="bordered" color="primary" radius="full" onPress={() => { router.push(`${constants.path.LOGS}/overview/${data.id}`) }}>Show Logs</Button>
              </div>
              <div className="grid lg:grid-cols-5 w-full">
                <div className="col-span-2">
                  <Table classNames={classNames} removeWrapper aria-label="Permissions table">
                    <TableHeader>
                      <TableColumn className="text-primary" width={5} align="end"> </TableColumn>
                      <TableColumn className="text-primary" width={70} align="end">Name</TableColumn>
                      <TableColumn className="text-primary" width={70} align="end">Total</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div
                            className="rounded-full bg-[#3b82f6] mr-1"
                            style={{
                              width: '10px',
                              height: '10px',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          Debug
                        </TableCell>
                        <TableCell>{formatK(data.log_count_debug)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div
                            className="rounded-full bg-[#22c55e] mr-1"
                            style={{
                              width: '10px',
                              height: '10px',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          Info
                        </TableCell>
                        <TableCell>{formatK(data.log_count_info)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div
                            className="rounded-full bg-[#f59e0b] mr-1"
                            style={{
                              width: '10px',
                              height: '10px',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          Warning
                        </TableCell>
                        <TableCell>{formatK(data.log_count_warning)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div
                            className="rounded-full bg-[#ef4444] mr-1"
                            style={{
                              width: '10px',
                              height: '10px',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          Error
                        </TableCell>
                        <TableCell>{formatK(data.log_count_error)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="col-span-3">
                  <VizLineChart
                    title=""
                    data={loadAverageData}
                    showLegend={false}
                    height={160}
                    removeWrapper
                  />
                </div>
              </div>
            </CardBody>
          </Card>
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
      ))}
      <AppPagination page={store.paging.page!} totalPage={1} totalRows={5} startRow={1} endRow={5} onPageChange={(page: number) => { }} />
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
