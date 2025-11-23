"use client";

import React from "react";
import { Pagination } from "@heroui/react";

type Props = {
  page: number;
  totalPage: number;
  totalRows: number;
  startRow: number;
  endRow: number;
  onPageChange?: (page: number) => void;
};

export default function AppPagination({
  page,
  totalPage,
  totalRows,
  startRow,
  endRow,
  onPageChange,
}: Props) {
  return (
    <div className="flex w-full justify-between items-center px-2 max-sm:flex-col max-sm:justify-center">
      <p className="text-sm text-default-500 max-sm:mb-5">
        {totalRows > 0
          ? `Showing ${startRow}-${endRow} of ${totalRows} entries`
          : "No data to display"}
      </p>

      {totalPage > 0 ? (
        <Pagination
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPage}
          onChange={(v: number) => onPageChange?.(v)}
        />
      ) : (
        <div />
      )}
    </div>
  );
}
