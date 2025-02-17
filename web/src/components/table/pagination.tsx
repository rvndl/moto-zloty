import { Button } from "@components";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

interface Props<TColumn> {
  table: Table<TColumn>;
}

const Pagination = <TColumn,>({ table }: Props<TColumn>) => {
  return (
    <div className="flex items-center justify-end w-full mt-4">
      <p className="mr-10 text-sm font-medium">
        Strona {table.getState().pagination.pageIndex + 1} z{" "}
        {table.getPageCount()}
      </p>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          className="w-8 h-8 p-0"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeftIcon className="scale-[0.68]" />
        </Button>
        <Button
          variant="outline"
          className="w-8 h-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon className="scale-[0.68]" />
        </Button>
        <Button
          variant="outline"
          className="w-8 h-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon className="scale-[0.68]" />
        </Button>
        <Button
          variant="outline"
          className="w-8 h-8 p-0"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRightIcon className="scale-[0.68]" />
        </Button>
      </div>
    </div>
  );
};

export { Pagination };
