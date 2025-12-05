"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import Datatable from "@/components/common/datatable";
import Filter from "@/components/common/filter";
import constants from "@/utils/constants";
import { TableColumnType, TableRowType } from "@/types/table";
import { FilterField } from "@/types/filter";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchDashboard } from "@/redux/api/dashboard-api";
import { useLoading } from "@/hooks/useLoading";
import RenderCell from "./render-cell";
import { clearDashboard } from "@/redux/slices/dashboard-slice";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.dashboard);
  const isLoading = useLoading("dashboard");

  const fields: FilterField[] = [
    { type: "input", key: "name", label: "Name" },
  ];

  const columns: TableColumnType[] = [
    { key: "action", label: "Action", width: 50, align: "center" },
    { key: "name", label: "Name", width: 200 },
    { key: "host", label: "Host" },
    { key: "description", label: "Description" },
    { key: "status", label: "Status" },
  ];

  const renderCell = (item: TableRowType, columnKey: React.Key) => (
    <RenderCell item={item} columnKey={columnKey} />
  );

  useEffect(() => {
    dispatch(fetchDashboard({ ...store.params, ...store.paging }));

    return () => {
      dispatch(clearDashboard());
    };
  }, [dispatch]);

  return (
    <div className="3xl:w-[60%] flex flex-col gap-4">
      <Filter
        fields={fields}
        onFilter={(data) => {
          dispatch(fetchDashboard({ ...data, ...store.paging, page: 1 }));
        }}
        onClear={() => {
          dispatch(fetchDashboard({ ...store.paging, page: 1 }));
        }}
      />
      <Datatable
        columns={columns}
        rows={store.data}
        renderCell={renderCell}
        loading={isLoading}
        page={store.paging.page!}
        totalPage={store.paging.totalPage!}
        totalRows={store.paging.totalRows!}
        onPageChange={(page: number) => {
          dispatch(fetchDashboard({ ...store.params, ...store.paging, page }));
        }}
        doAdd={() => router.push(`${constants.path.DASHBOARD}/add`)}
      />
    </div>
  );
}
