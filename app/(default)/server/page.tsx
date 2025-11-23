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
import { fetchServers } from "@/redux/api/server-api";
import { useLoading } from "@/hooks/useLoading";
import RenderCell from "./render-cell";
import { clearServer } from "@/redux/slices/server-slice";

export default function ServerPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.server);
  const isLoading = useLoading("server");

  const fields: FilterField[] = [
    { type: "input", key: "server_name", label: "Name" },
  ];

  const columns: TableColumnType[] = [
    { key: "action", label: "Action", width: 50, align: "center" },
    { key: "server_name", label: "Name", width: 200 },
    { key: "host", label: "Host" },
    { key: "description", label: "Description" },
    { key: "status", label: "Status" },
  ];

  const renderCell = (item: TableRowType, columnKey: React.Key) => (
    <RenderCell item={item} columnKey={columnKey} />
  );

  useEffect(() => {
    dispatch(fetchServers({ ...store.params, ...store.paging }));

    return () => {
      dispatch(clearServer());
    };
  }, [dispatch]);

  return (
    <div className="3xl:w-[60%] flex flex-col gap-4">
      <Filter
        fields={fields}
        onFilter={(data) => {
          dispatch(fetchServers({ ...data, ...store.paging, page: 1 }));
        }}
        onClear={() => {
          dispatch(fetchServers({ ...store.paging, page: 1 }));
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
          dispatch(fetchServers({ ...store.params, ...store.paging, page }));
        }}
        doAdd={() => router.push(`${constants.path.SERVER}/add`)}
      />
    </div>
  );
}
