import { ReactNode, useState } from "react";
import { Sidebar, SidebarItemProps } from "./sidebar";
import clsx from "clsx";
import { Breadcrumbs, BreadcrumbProps } from "./breadcrumbs";
import { PageHeader } from "./page-header";

interface Props {
  title?: string;
  sidebarItems?: SidebarItemProps[];
  breadcrumbs?: BreadcrumbProps[];
  headerContent?: ReactNode;
  isTitleTabSeperated?: boolean;
  isInline?: boolean;
  children: ((tab?: string) => ReactNode) | ReactNode;
  as?: React.ElementType;
}

const Page = ({
  title,
  sidebarItems,
  breadcrumbs,
  isInline,
  headerContent,
  children,
  as = "div",
}: Props) => {
  const [activeTab, setActiveTab] = useState(sidebarItems?.[0]?.label);

  const Wrapper = as;

  return (
    <Wrapper className="flex flex-col w-full h-full p-2 md:p-0">
      <PageHeader title={title} content={headerContent} activeTab={activeTab} />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div
        className={clsx(
          "flex w-full h-full gap-2 md:gap-4 mt-1 md:mt-2",
          !isInline && "flex-col",
        )}
      >
        {sidebarItems && (
          <section className="md:w-auto">
            <Sidebar items={sidebarItems} onChange={setActiveTab} />
          </section>
        )}
        <section className="flex-1">
          {typeof children === "function" ? children(activeTab) : children}
        </section>
      </div>
    </Wrapper>
  );
};

export { Page };
