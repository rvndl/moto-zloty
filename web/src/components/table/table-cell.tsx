import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends HTMLAttributes<HTMLTableCellElement> {
  isBolded?: boolean;
  isRightAligned?: boolean;
}

const TableCell = ({ className, isBolded, isRightAligned, ...rest }: Props) => {
  return (
    <td
      className={twMerge(
        "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        isBolded && "font-semibold",
        isRightAligned && "text-right",
        className
      )}
      {...rest}
    />
  );
};

export { TableCell };
