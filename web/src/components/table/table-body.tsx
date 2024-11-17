import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = HTMLAttributes<HTMLTableSectionElement>;

const TableBody = ({ className, ...rest }: Props) => {
  return (
    <tbody
      className={twMerge("[&_tr:last-child]:border-0", className)}
      {...rest}
    />
  );
};

export { TableBody };
