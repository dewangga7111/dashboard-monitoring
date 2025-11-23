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
import { fetchDivision } from "@/redux/api/division-api";
import { useLoading } from "@/hooks/useLoading";
import RenderCell from "./render-cell";
import { clearDivision } from "@/redux/slices/division-slice";

export default function DivisionPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.division);
  const isLoading = useLoading("division");

  const fields: FilterField[] = [
    { type: "input", key: "division_name", label: "Name" },
  ];

  const columns: TableColumnType[] = [
    { key: "action", label: "Action", width: 50, align: "center" },
    { key: "division_name", label: "Name", width: 200 },
    { key: "description", label: "Description" },
  ];

  const renderCell = (item: TableRowType, columnKey: React.Key) => (
    <RenderCell item={item} columnKey={columnKey} />
  );

  useEffect(() => {
    dispatch(fetchDivision({ ...store.params, ...store.paging }));

    return () => {
      dispatch(clearDivision());
    };
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-4">
      <Filter
        fields={fields}
        onFilter={(data) => {
          dispatch(fetchDivision({ ...data, ...store.paging, page: 1 }));
        }}
        onClear={() => {
          dispatch(fetchDivision({ ...store.paging, page: 1 }));
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
          dispatch(fetchDivision({ ...store.params, ...store.paging, page }));
        }}
        doAdd={() => router.push(`${constants.path.DIVISION}/add`)}
      />
    </div>
  );
}
