import { Fragment } from "react/jsx-runtime";
import { Breadcrumb, BreadcrumbProps } from "./breadcrumb";
import { BreadcrumbSeparator } from "./breadcrumb-separator";

const INITIAL_BREADCRUMB: BreadcrumbProps = {
  label: process.env.NEXT_PUBLIC_SITE_NAME as string,
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
    <ol className="flex flex-wrap items-center break-words text-sm text-muted-foreground mt-1">
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
