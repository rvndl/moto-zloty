import { HTMLAttributes, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  InitialTableState,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { TableHeader } from "./table-header";
import { TableHead } from "./table-head";
import { TableBody } from "./table-body";
import { TableRow } from "./table-row";
import { TableCell } from "./table-cell";
import { ArrowDownIcon, ArrowUpIcon } from "@components";
import { Pagination } from "./pagination";

const DEFAULT_PAGE_SIZE = 10;

interface Props<TColumn> extends HTMLAttributes<HTMLTableElement> {
  data?: TColumn[];
  columns: ColumnDef<TColumn, unknown>[];
  pageSize?: number;
  initialState?: InitialTableState;
}

// TODO: pagination/sorting/filtering should be server-side,
// or at least the data should be virtualized
const Table = <TColumn,>({
  data,
  columns,
  initialState,
  pageSize = DEFAULT_PAGE_SIZE,
  className,
  ...rest
}: Props<TColumn>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    initialState,
    state: {
      pagination,
    },
  });

  return (
    <div className="relative w-full overflow-auto">
      <table
        {...rest}
        className={twMerge("w-full caption-bottom text-sm ", className)}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isRightAligned =
                  header.column.columnDef.meta?.rightAligned;

                return (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    isRightAligned={isRightAligned}
                    className="cursor-pointer"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: (
                        <ArrowUpIcon className="inline-flex scale-[0.68] ml-1" />
                      ),
                      desc: (
                        <ArrowDownIcon className="inline-flex scale-[0.68] ml-1" />
                      ),
                    }[header.column.getIsSorted() as string] ?? null}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const bolded = cell.column.columnDef.meta?.bolded;
                const rightAligned = cell.column.columnDef.meta?.rightAligned;

                return (
                  <TableCell
                    isBolded={bolded}
                    isRightAligned={rightAligned}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </table>
      <div className="mt-4">
        <Pagination table={table} />
      </div>
    </div>
  );
};

export { Table };
