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
import { fetchUsers } from "@/redux/api/users-api";
import { useLoading } from "@/hooks/useLoading";
import RenderCell from "./render-cell";
import { clearUsers } from "@/redux/slices/users-slice";

export default function UsersPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.users);
  const isLoading = useLoading("users");

  const fields: FilterField[] = [
    { type: "input", key: "name", label: "Name" },
    {
      type: "autocomplete",
      key: "role",
      label: "Role",
      placeholder: "Select role",
      options: (store.data ?? []).map((opt) => ({
        label: opt.name,
        value: opt.name,
      })),
    },
    { type: "datepicker", key: "joinedAt", label: "Joined Date" },
    { type: "daterange", key: "activeRange", label: "Active Range" },
  ];

  const columns: TableColumnType[] = [
    { key: "action", label: "Action", width: 50, align: "center" },
    { key: "firstName", label: "Name", width: 200 },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
  ];

  const renderCell = (item: TableRowType, columnKey: React.Key) => (
    <RenderCell item={item} columnKey={columnKey} />
  );

  useEffect(() => {
    dispatch(fetchUsers({ ...store.params, ...store.paging }));

    return () => {
      dispatch(clearUsers());
    };
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-4">
      <Filter
        fields={fields}
        onFilter={(data) => {
          dispatch(fetchUsers({ ...data, ...store.paging, page: 1 }));
        }}
        onClear={() => {
          dispatch(fetchUsers({ ...store.paging, page: 1 }));
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
          dispatch(fetchUsers({ ...store.params, ...store.paging, page }));
        }}
        doAdd={() => router.push(`${constants.path.USERS}/add`)}
      />
    </div>
  );
}
