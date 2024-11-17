import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = HTMLAttributes<HTMLTableCellElement>;

const TableCell = ({ className, ...rest }: Props) => {
  return (
    <td
      className={twMerge(
        "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...rest}
    />
  );
};

export { TableCell };
