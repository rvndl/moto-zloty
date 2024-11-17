import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = HTMLAttributes<HTMLTableCellElement>;

const TableHead = ({ className, ...rest }: Props) => {
  return (
    <th
      className={twMerge(
        "h-10 px-2 text-left align-middle font-medium text-muted [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...rest}
    />
  );
};

export { TableHead };
