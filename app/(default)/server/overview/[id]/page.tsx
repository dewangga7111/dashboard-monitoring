"use client";

import BigNumberMetric from "@/components/charts/big-number-metric";
import { Card, CardBody, Chip, Divider, Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import AppLineChart from "@/components/charts/app-line-chart";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatFromMB } from "@/utils/common";

export default function ServerOverviewPage() {
  const [isOpenCpu, setIsOpenCpu] = useState(true);
  const [isOpenMemory, setIsOpenMemory] = useState(true);
  const [isOpenDisk, setIsOpenDisk] = useState(true);
  const [isOpenNetwork, setIsOpenNetwork] = useState(true);

  const cardInfo = (title: string, value: string) => {
    return (
      <Card>
        <CardBody className="flex flex-col items-center">
          <div className="font-semibold text-sm">{title}</div>
          <div className="text-xl mt-3 text-success">{value}</div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <span className="text-gray-600 text-lg font-semibold">Server Name: Production Server</span>
        <Chip color="success" variant="flat" size="lg">
          <div className="flex items-center">
            <div
              className="rounded-full bg-success mr-1"
              style={{
                width: '10px',
                height: '10px',
              }}
            />
            Online
          </div>
        </Chip>
      </div>
      <div className="w-full">
        <Divider />
      </div>
      <div className="grid lg:grid-cols-4 gap-4 w-full">
        {cardInfo("Uptime", "350 Days")}
        {cardInfo("Host", "192.168.1.1")}
        {cardInfo("Kernel Version", "5.10.0-11-amd64")}
        {cardInfo("OS", "Ubuntu 20.04")}
        {cardInfo("CPU Count", "4")}
        {cardInfo("Memory Total", "64GB")}
        {cardInfo("Total Swap", "16GB")}
        {cardInfo("Root Mount Size", "10GiB")}
      </div>

      {/* ----- CPU ----- */}
      <div
        className="flex items-center cursor-pointer select-none"
        onClick={() => setIsOpenCpu((prev) => !prev)}
      >
        <motion.div
          animate={{ rotate: isOpenCpu ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <ChevronUp size={18} />
        </motion.div>
        <span className="text-gray-600 text-md font-semibold mx-2">CPU</span>
        <div className="w-full">
          <Divider />
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isOpenCpu && (
          <motion.div
            key="filter-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="grid lg:grid-cols-4 gap-4 w-full"
          >
            <BigNumberMetric
              title="CPU Usage"
              data={[2, 3, 4, 5, 4.2, 4.5, 4.0, 4.3]}
            />
            <div className="col-span-2">
              <AppLineChart
                title="CPU Usage"
                data={cpuData}
                ySuffix="%"
              />
            </div>
            <AppLineChart
              title="Load Average"
              data={loadAverageData}
              ySuffix="%"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----- MEMORY ----- */}
      <div
        className="flex items-center cursor-pointer select-none"
        onClick={() => setIsOpenMemory((prev) => !prev)}
      >
        <motion.div
          animate={{ rotate: isOpenMemory ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <ChevronUp size={18} />
        </motion.div>
        <span className="text-gray-600 text-md font-semibold mx-2">Memory</span>
        <div className="w-full">
          <Divider />
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isOpenMemory && (
          <motion.div
            key="filter-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="grid lg:grid-cols-4 gap-4 w-full"
          >
            <BigNumberMetric
              title="Memory Usage"
              data={[2, 3, 4, 5, 4.2, 4.5, 4.0, 4.3]}
            />
            <div className="col-span-3">
              <AppLineChart
                title="Memory Usage"
                data={memoryUsageData}
                withArea={true}
                ySuffix="GB"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----- DISK ----- */}
      <div
        className="flex items-center cursor-pointer select-none"
        onClick={() => setIsOpenDisk((prev) => !prev)}
      >
        <motion.div
          animate={{ rotate: isOpenDisk ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <ChevronUp size={18} />
        </motion.div>
        <span className="text-gray-600 text-md font-semibold mx-2">Disk</span>
        <div className="w-full">
          <Divider />
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isOpenDisk && (
          <motion.div
            key="filter-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="grid lg:grid-cols-4 gap-4 w-full"
          >
            <div className="col-span-2">
              <AppLineChart
                title="DISK I/O"
                data={diskIOData}
                ySuffix="MB/s"
              />
            </div>
            <div className="col-span-2">
              <Card className="h-full">
                <CardBody>
                  <div className="font-semibold text-center mb-5">Disk Space Usage</div>
                  <Table removeWrapper aria-label="Permissions table">
                    <TableHeader>
                      <TableColumn width={130}>Mounted On</TableColumn>
                      <TableColumn width={70} align="end">Size</TableColumn>
                      <TableColumn width={70} align="end">Available</TableColumn>
                      <TableColumn width={70} align="end">Used</TableColumn>
                      <TableColumn width={150} align="end">Used %</TableColumn>
                    </TableHeader>

                    <TableBody>
                      {diskSpaceUsage.map((menu) => (
                        <TableRow key={menu.mount}>
                          <TableCell>{menu.mount}</TableCell>
                          <TableCell>{formatFromMB(menu.size)}</TableCell>
                          <TableCell>{formatFromMB(menu.available)}</TableCell>
                          <TableCell>{formatFromMB(menu.used)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Progress value={(menu.used / menu.size) * 100} />
                              <span className="text-sm ml-2 text-primary">{((menu.used / menu.size) * 100).toFixed(2)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----- NETWORK ----- */}
      <div
        className="flex items-center cursor-pointer select-none"
        onClick={() => setIsOpenNetwork((prev) => !prev)}
      >
        <motion.div
          animate={{ rotate: isOpenNetwork ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <ChevronUp size={18} />
        </motion.div>
        <span className="text-gray-600 text-md font-semibold mx-2">Network</span>
        <div className="w-full">
          <Divider />
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isOpenNetwork && (
          <motion.div
            key="filter-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="grid lg:grid-cols-4 gap-4 w-full"
          >
            <div className="col-span-2">
              <AppLineChart
                title="Network Traffic"
                data={networkTrafficData}
                ySuffix="kb/s"
                withArea
              />
            </div>
            <div className="col-span-2">
              <AppLineChart
                title="Network Errors and Dropped Packets"
                data={networkErrorsData}
                ySuffix="p/s"
                withArea
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const cpuData = {
  labels: ['08:00', '08:05', '08:10', '08:15', '08:20', '08:25', '08:30', '08:35'],
  datasets: [
    {
      label: 'CPU 0',
      data: [0, 15, 30, 25, 45, 60, 55, 40],
      borderColor: '#22c55e'
    }
  ]
};

const loadAverageData = {
  labels: ['08:00', '08:05', '08:10', '08:15', '08:20', '08:25', '08:30', '08:35'],
  datasets: [
    {
      label: '1m Load Average',
      data: [0, 15, 30, 25, 45, 60, 55, 40],
      borderColor: '#22c55e'
    },
    {
      label: '5m Load Average',
      data: [10, 25, 20, 35, 50, 45, 65, 55],
      borderColor: '#3b82f6'
    },
    {
      label: '15m Load Average',
      data: [5, 20, 25, 30, 40, 50, 60, 50],
      borderColor: '#f59e0b'
    }
  ]
};

const memoryUsageData = {
  labels: ['08:00', '08:05', '08:10', '08:15', '08:20', '08:25', '08:30', '08:35'],
  datasets: [
    {
      label: 'Used',
      data: [22, 24, 26, 28, 30, 34, 38, 36],
      borderColor: '#ef4444'
    },
    {
      label: 'Buffer',
      data: [0.6, 0.65, 0.7, 0.72, 0.75, 0.8, 0.85, 0.82],
      borderColor: '#22c55e'
    },
    {
      label: 'Cached',
      data: [4.5, 5.2, 6.1, 6.8, 7.5, 8.2, 9.3, 8.7],
      borderColor: '#3b82f6'
    },
    {
      label: 'Free',
      data: [28, 26, 24, 23, 21, 18, 15, 20],
      borderColor: '#f59e0b'
    },
    {
      label: 'Available',
      data: [33, 32, 31, 30.5, 29, 27, 25.5, 28],
      borderColor: '#a855f7'
    },
    {
      label: 'Total',
      data: [64, 64, 64, 64, 64, 64, 64, 64],
      borderColor: '#6b7280'
    }
  ]
};

const diskIOData = {
  labels: ['08:00', '08:05', '08:10', '08:15', '08:20', '08:25', '08:30', '08:35'],

  datasets: [
    {
      label: 'Read',
      data: [50, 120, 80, 150, 200, 180, 130, 90],
      borderColor: '#3b82f6' // blue
    },
    {
      label: 'Write',
      data: [40, 60, 55, 100, 160, 140, 100, 70],
      borderColor: '#22c55e' // green
    },
  ]
};

const diskSpaceUsage = [
  {
    mount: '/',
    size: 10300,
    used: 6400,
    available: 3900,
  },
  {
    mount: '/run',
    size: 209,
    used: 21,
    available: 188,
  },
  {
    mount: '/run/lock',
    size: 5.24,
    used: 0,
    available: 5.24,
  },
]

const networkTrafficData = {
  labels: ['08:00', '08:05', '08:10', '08:15', '08:20', '08:25', '08:30', '08:35'],
  datasets: [
    {
      label: 'eth0 received',
      data: [180, 185, 190, 185, 188, 182, 190, 185],
      borderColor: '#22c55e' // green
    },
    {
      label: 'lo received',
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: '#eab308' // yellow
    },
    {
      label: 'eth0 transmitted',
      data: [-350, -380, -320, -400, -280, -420, -380, -320],
      borderColor: '#3b82f6' // blue
    },
    {
      label: 'lo transmitted',
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: '#f97316' // orange
    }
  ]
};

const networkErrorsData = {
  labels: ['08:00', '08:05', '08:10', '08:15', '08:20', '08:25', '08:30', '08:35'],
  datasets: [
    {
      label: 'eth0 errors received',
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: '#22c55e' // green
    },
    {
      label: 'lo errors received',
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: '#eab308' // yellow
    },
    {
      label: 'eth0 errors transmitted',
      data: [20, 8, 5, 0, 0, 0, 0, 0],
      borderColor: '#3b82f6' // blue
    },
    {
      label: 'lo errors transmitted',
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: '#f97316' // orange
    },
    {
      label: 'eth0 drops received',
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: '#ef4444' // red
    },
    {
      label: 'lo drops received',
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: '#3b82f6' // blue
    },
    {
      label: 'eth0 drops transmitted',
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: '#a855f7' // purple
    },
    {
      label: 'lo drops transmitted',
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: '#8b5cf6' // purple variant
    }
  ]
};