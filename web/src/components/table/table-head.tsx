import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends HTMLAttributes<HTMLTableCellElement> {
  isRightAligned?: boolean;
}

const TableHead = ({ className, isRightAligned, ...rest }: Props) => {
  return (
    <th
      className={twMerge(
        "h-10 px-2 align-middle font-medium text-muted [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        isRightAligned ? "text-right" : "text-left",
        className
      )}
      {...rest}
    />
  );
};

export { TableHead };
