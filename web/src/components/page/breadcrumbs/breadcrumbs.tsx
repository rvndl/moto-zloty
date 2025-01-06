import { Fragment } from "react/jsx-runtime";
import { Breadcrumb, BreadcrumbProps } from "./breadcrumb";
import { BreadcrumbSeparator } from "./breadcrumb-separator";

const INITIAL_BREADCRUMB: BreadcrumbProps = {
  label: import.meta.env.VITE_SITE_NAME,
  to: "/",
};

interface Props {
  breadcrumbs?: BreadcrumbProps[];
}

const Breadcrumbs = ({ breadcrumbs }: Props) => {
  if (!breadcrumbs?.length) {
    return null;
  }

  return (
    <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5 mt-1">
      {[INITIAL_BREADCRUMB, ...breadcrumbs]?.map((breadcrumb, index) => (
        <Fragment key={index}>
          <Breadcrumb {...breadcrumb} />
          {index !== breadcrumbs?.length && <BreadcrumbSeparator />}
        </Fragment>
      ))}
    </ol>
  );
};

export { Breadcrumbs };
