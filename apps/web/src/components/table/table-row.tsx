import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = HTMLAttributes<HTMLTableRowElement>;

const TableRow = ({ className, ...rest }: Props) => {
  return (
    <tr
      className={twMerge(
        "border-b transition-colors hover:bg-muted/5 data-[state=selected]:bg-muted",
        className
      )}
      {...rest}
    />
  );
};

export { TableRow };
