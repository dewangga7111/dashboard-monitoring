"use client";

import BigNumberMetric from "@/components/charts/viz-stat-chart";
import { Card, CardBody, Chip, Divider, Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import VizLineChart from "@/components/charts/viz-line-chart";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatFromMB } from "@/utils/common";
import AppAutocomplete from "@/components/common/app-autocomplete";
import AppGaugeChart from "@/components/charts/app-gauge-chart";
import AppPieChart from "@/components/charts/app-pie-chart";
import AppBarChart from "@/components/charts/viz-bar-chart";

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
        <AppAutocomplete className="w-sm" items={[]} itemLabel={"server_name"} itemValue={"id"} placeholder="Select Server..." />
      </div>
      <div className="w-full">
        <Divider />
      </div>
      <div className="grid lg:grid-cols-4 gap-4 w-full">
        <AppPieChart
          title="Network Device Availability"
          data={[
            { name: 'Available', value: 65, color: '#22c55e' },
            { name: 'Unavailable', value: 35, color: '#ef4444' }
          ]}
          height={300}
          innerRadius={60}
        />
        <Card className="col-span-3">
          <CardBody>
            <div className="font-semibold text-center mb-5">Network Interface Availability</div>
            <div className="grid grid-cols-2 gap-4 justify-items-center">
              <div className="w-80">
                <AppGaugeChart
                  value={54}
                  max={100}
                  unit="Up"
                  height={300}
                  color="#3366CC"
                  withWrapper={false}
                />
              </div>
              <div className="w-80">
                <AppGaugeChart
                  value={46}
                  max={100}
                  unit="Down"
                  height={300}
                  color="#ef4444"
                  withWrapper={false}
                />
              </div>
            </div>
          </CardBody>
        </Card>
        <div className="col-span-2">
          <VizLineChart
            title="Total Traffic"
            data={gatewayData}
            withArea={true}
            height={300}
            ySuffix=" Gbit/s"
            showGrid={true}
          />
        </div>
        <AppGaugeChart
          title="Total Network Inbound"
          value={0.4634}
          max={3.5239}
          unit="Gbit/s"
          height={300}
          color="#3366CC"
        />
        <AppGaugeChart
          title="Total Network Outbound"
          value={9.93}
          max={11.19}
          unit="Gbit/s"
          height={300}
          color="#EF4444"
        />

        {/* Switch Chart */}
        <div className="col-span-4">
          <VizLineChart
            title="Switch"
            data={switchData}
            withArea={true}
            height={250}
            ySuffix=" Mb/s"
            showGrid={true}
          />
        </div>

        <div className="col-span-2">
          <AppBarChart
            title="Traffic Utilization"
            data={trafficUtilizationData}
            stacked={true}
            height={300}
            ySuffix="%"
            showGrid={true}
            showLegend={false}
          />
        </div>

        <div className="col-span-2">
          <VizLineChart
            title="Anomaly Detection"
            data={anomalyDetectionData}
            withArea={true}
            height={300}
            ySuffix="%"
            showGrid={true}
          />
        </div>

        <div className="col-span-2">
          <VizLineChart
            title="Network Device Latency"
            data={networkLatencyData}
            withArea={true}
            height={350}
            ySuffix=" ms"
            showGrid={true}
            showLegend={false}
          />
        </div>

        <div className="col-span-2">
          <AppPieChart
            title="Top Network Devices by CPU"
            data={topDevicesCPUData}
            height={350}
            showLegend={true}
            withLabel={false}
          />
        </div>
      </div>
    </div>
  );
}

// Gateway Chart Data
const gatewayData = {
  labels: [
    '04:10', '04:20', '04:30', '04:40', '04:50', '05:00', '05:10', '05:20',
    '05:30', '05:40', '05:50', '06:00', '06:10', '06:20', '06:30', '06:40',
    '06:50', '07:00', '07:10', '07:20', '07:30', '07:40', '07:50', '08:00',
    '08:10', '08:20', '08:30', '08:40', '08:50', '09:00', '09:10', '09:20',
    '09:30', '09:40', '09:50', '10:00'
  ],
  datasets: [
    {
      label: 'Inbound',
      data: [
        0.5, 0.6, 0.5, 0.7, 1.2, 0.8, 0.6, 0.5, 0.7, 0.9, 1.5, 0.8, 0.6,
        0.5, 0.6, 0.7, 0.5, 0.6, 8.5, 0.7, 0.6, 0.5, 0.7, 0.6, 0.5, 0.6,
        0.5, 0.7, 1.8, 0.6, 0.5, 0.6, 0.7, 0.5, 0.6, 0.5
      ],
      borderColor: '#22c55e'
    },
    {
      label: 'Outbound',
      data: [
        0.3, 0.4, 0.3, -2.5, 0.4, 0.5, 0.4, 0.3, 0.4, 0.5, 0.6, 0.4, 0.3,
        0.4, 0.3, 0.4, 0.3, 0.4, 0.5, 0.4, 0.3, 0.4, 0.3, 0.4, 0.3, 0.4,
        0.3, 0.4, 0.5, 0.3, 0.4, 0.3, 0.4, 0.3, 0.4, 0.3
      ],
      borderColor: '#f59e0b'
    }
  ]
};

// Switch Chart Data
const switchData = {
  labels: [
    '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00',
    '08:30', '09:00', '09:30', '10:00'
  ],
  datasets: [
    {
      label: 'Tx',
      data: [2.5, 3.2, 4.5, 3.8, 2.9, 3.5, 8.2, -8.5, 3.1, 2.8, 3.0, 2.9],
      borderColor: '#22c55e'
    },
    {
      label: 'Rx',
      data: [-3.2, -2.8, -4.2, -3.5, -8.0, -3.8, -2.9, -3.2, -2.7, -3.0, -2.8, -2.9],
      borderColor: '#f59e0b'
    }
  ]
};

const trafficUtilizationData = {
  labels: [
    '2 May', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00'
  ],
  datasets: [
    {
      label: 'Type 1',
      data: [15, 18, 20, 17, 19, 21, 18, 20, 19, 17, 18, 19, 20, 18, 19, 21, 20, 18, 19, 17, 18, 20, 19, 21, 20, 18, 19, 17, 18, 19, 20, 18],
      backgroundColor: '#eab308' // yellow
    },
    {
      label: 'Type 2',
      data: [12, 14, 15, 13, 14, 16, 15, 14, 15, 13, 14, 15, 16, 14, 15, 16, 15, 14, 15, 13, 14, 15, 14, 16, 15, 14, 15, 13, 14, 15, 16, 14],
      backgroundColor: '#f97316' // orange
    },
    {
      label: 'Type 3',
      data: [10, 12, 11, 10, 11, 13, 12, 11, 12, 10, 11, 12, 13, 11, 12, 13, 12, 11, 12, 10, 11, 12, 11, 13, 12, 11, 12, 10, 11, 12, 13, 11],
      backgroundColor: '#ef4444' // red
    },
    {
      label: 'Type 4',
      data: [8, 10, 9, 8, 9, 11, 10, 9, 10, 8, 9, 10, 11, 9, 10, 11, 10, 9, 10, 8, 9, 10, 9, 11, 10, 9, 10, 8, 9, 10, 11, 9],
      backgroundColor: '#3b82f6' // blue
    },
    {
      label: 'Type 5',
      data: [6, 8, 7, 6, 7, 9, 8, 7, 8, 6, 7, 8, 9, 7, 8, 9, 8, 7, 8, 6, 7, 8, 7, 9, 8, 7, 8, 6, 7, 8, 9, 7],
      backgroundColor: '#06b6d4' // cyan
    },
    {
      label: 'Type 6',
      data: [4, 6, 5, 4, 5, 7, 6, 5, 6, 4, 5, 6, 7, 5, 6, 7, 6, 5, 6, 4, 5, 6, 5, 7, 6, 5, 6, 4, 5, 6, 7, 5],
      backgroundColor: '#22c55e' // green
    }
  ]
};

// Anomaly Detection - Area Chart Data
const anomalyDetectionData = {
  labels: [
    '2 May', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00'
  ],
  datasets: [
    {
      label: 'Normal',
      data: [5, 8, 6, 4, 3, 7, 5, 4, 6, 5, 4, 3, 5, 18, 4, 3, 2, 5, 4, 3, 2, 4, 18, 6, 5, 4, 6, 5, 4, 6, 8, 27],
      borderColor: '#3b82f6'
    },
    {
      label: 'Anomaly',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0],
      borderColor: '#ef4444'
    }
  ]
};

const networkLatencyData = {
  labels: [
    '14. Apr', '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ],
  datasets: [
    {
      label: 'Device 1',
      data: [120, 150, 280, 160, 140, 200, 210, 160, 140, 150, 140, 50, 40],
      borderColor: '#ef4444' // red
    },
    {
      label: 'Device 2',
      data: [80, 100, 180, 120, 100, 150, 160, 120, 100, 110, 100, 40, 30],
      borderColor: '#f97316' // orange
    },
    {
      label: 'Device 3',
      data: [60, 80, 140, 90, 80, 120, 130, 90, 80, 85, 80, 35, 25],
      borderColor: '#eab308' // yellow
    },
    {
      label: 'Device 4',
      data: [40, 60, 100, 70, 60, 90, 100, 70, 60, 65, 60, 30, 20],
      borderColor: '#22c55e' // green
    },
    {
      label: 'Device 5',
      data: [30, 50, 80, 60, 50, 75, 85, 60, 50, 55, 50, 25, 18],
      borderColor: '#06b6d4' // cyan
    },
    {
      label: 'Device 6',
      data: [20, 40, 60, 50, 40, 60, 70, 50, 40, 45, 40, 20, 15],
      borderColor: '#3b82f6' // blue
    }
  ]
};

// Top Network Devices by CPU - Pie Chart
const topDevicesCPUData = [
  { name: 'isis2.isis2: 24.13%', value: 24.13, color: '#3b82f6' }, // blue
  { name: 'HB2.HB2.com: 23.92%', value: 23.92, color: '#22c55e' }, // green
  { name: 'HB3.hb3.com: 23.63%', value: 23.63, color: '#eab308' }, // yellow
  { name: 'cisco2960.motadata.local: 19.61%', value: 19.61, color: '#f97316' }, // orange
  { name: 'bgp2.bgp2.com: 18.59%', value: 18.59, color: '#ef4444' }, // red/pink
  { name: 'bgp1.bgp1.com: 18.56%', value: 18.56, color: '#a855f7' }, // purple
  { name: 'HB1.hb1.com: 15.24%', value: 15.24, color: '#8b5cf6' }, // violet
  { name: 'fg_firewall.mindarray.com: 3.06%', value: 3.06, color: '#06b6d4' } // cyan
];