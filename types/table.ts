export interface TableColumnType {
  key: string;
  label: string;
  width?: string | number;
  align?: 'start' | 'center' | 'end';
}

export interface TableRowType {
  [key: string]: any;
}

export interface TableFilter {
  [key: string]: any;
}

export interface TablePaging {
  page?: number,
  totalPage?: number,
  totalRows?: number,
  limit?: number,
}

export interface RenderCellProps {
  item: TableRowType;
  columnKey: React.Key;
};

export interface DynamicTableProps {
  columns: TableColumnType[];
  rows: TableRowType[];
  title?: string;
  emptyContent?: string;
  loading?: boolean;
  className?: string;
  page: number;
  totalPage: number;
  totalRows: number;
  doAdd: () => void;
  onPageChange: (page: number) => void;
  renderCell?: (item: TableRowType, columnKey: React.Key) => React.ReactNode;  // Fix: Use React.Key
}