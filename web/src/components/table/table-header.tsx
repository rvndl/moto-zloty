import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = HTMLAttributes<HTMLTableSectionElement>;

const TableHeader = ({ className, ...rest }: Props) => {
  return <thead className={twMerge("[&_tr]:border-b", className)} {...rest} />;
};

export { TableHeader };
