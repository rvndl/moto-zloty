import { Fragment } from "react/jsx-runtime";
import { Breadcrumb, BreadcrumbProps } from "./breadcrumb";
import { BreadcrumbSeparator } from "./breadcrumb-separator";

interface Props {
  breadcrumbs?: BreadcrumbProps[];
}

const Breadcrumbs = ({ breadcrumbs }: Props) => {
  return (
    <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5 mt-1">
      {breadcrumbs?.map((breadcrumb, index) => (
        <Fragment key={index}>
          <Breadcrumb {...breadcrumb} />
          {index !== breadcrumbs?.length - 1 && <BreadcrumbSeparator />}
        </Fragment>
      ))}
    </ol>
  );
};

export { Breadcrumbs };
