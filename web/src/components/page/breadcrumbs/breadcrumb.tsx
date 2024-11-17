import clsx from "clsx";
import { Link } from "react-router-dom";

interface BreadcrumbProps {
  label: string;
  to?: string;
  isActive?: boolean;
}

const Breadcrumb = ({ label, to, isActive }: BreadcrumbProps) => {
  return (
    <li className="inline-flex items-center gap-1.5">
      <a
        className={clsx(
          "font-normal transition-colors cursor-pointer hover:text-primary",
          isActive ? "text-primary" : "text-muted"
        )}
      >
        {to ? <Link to={to}>{label}</Link> : label}
      </a>
    </li>
  );
};

export { Breadcrumb, type BreadcrumbProps };
