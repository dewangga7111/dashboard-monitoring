import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Spinner
} from "@heroui/react";
import { TableRowType } from "@/types/table";

interface PrometheusTableViewProps {
  data: TableRowType[];
  loading: boolean;
}

export default function PrometheusTableView({ data, loading }: PrometheusTableViewProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Spinner size="lg" variant="wave"/>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        No data available
      </div>
    );
  }

  // Get all unique label keys across all rows
  const allLabelKeys = Array.from(
    new Set(data.flatMap(row => Object.keys(row.labels)))
  ).sort();
  
  return (
    <div className="overflow-x-auto">
      <Table aria-label="Prometheus query results" className="mt-3" removeWrapper>
        <TableHeader>
          <TableColumn key="metric">METRIC</TableColumn>
            {allLabelKeys.map(key => (
              <TableColumn key={key}>{key.toUpperCase()}</TableColumn>
            )) as any}
          <TableColumn key="value">VALUE</TableColumn>
          <TableColumn key="timestamp">TIMESTAMP</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <Tooltip content={row.query} placement="top">
                  <code className="text-xs bg-default-100 px-2 py-1 rounded">
                    {row.metric}
                  </code>
                </Tooltip>
              </TableCell>
                {allLabelKeys.map(key => (
                  <TableCell key={key}>
                    {row.labels[key] ? (
                      <Chip size="sm" variant="flat">
                        {row.labels[key]}
                      </Chip>
                    ) : (
                      <span className="text-default-400">-</span>
                    )}
                  </TableCell>
                )) as any}
              <TableCell>
                <span className="font-mono text-sm">
                  {typeof row.value === 'number'
                    ? row.value.toFixed(2)
                    : row.value
                  }
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xs text-default-500">
                  {row.timestamp}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}