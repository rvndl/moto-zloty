import { Skeleton } from "@components/skeleton";
import clsx from "clsx";
import Link from "next/link";

interface BreadcrumbProps {
  label: string;
  to?: string;
  isActive?: boolean;
  isLoading?: boolean;
}

const Breadcrumb = ({ label, to, isActive, isLoading }: BreadcrumbProps) => {
  const content = to ? <Link href={to}>{label}</Link> : label;
  return (
    <li className="inline-flex items-center gap-1.5">
      <span
        className={clsx(
          "font-normal transition-colors cursor-pointer hover:text-primary",
          isActive ? "text-primary" : "text-muted"
        )}
      >
        {isLoading ? <Skeleton className="h-5 w-36" /> : content}
      </span>
    </li>
  );
};

export { Breadcrumb, type BreadcrumbProps };
