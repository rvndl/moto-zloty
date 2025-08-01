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
    <Wrapper className="flex flex-col w-full h-full px-2 md:px-0 mt-2 md:mt-4">
      <PageHeader title={title} content={headerContent} activeTab={activeTab} />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div
        className={clsx(
          "flex w-full h-full gap-2 md:gap-4 mt-1 md:mt-2",
          !isInline && "flex-col",
        )}
      >
        {sidebarItems && (
          <aside className="md:w-auto mt-6">
            <Sidebar items={sidebarItems} onChange={setActiveTab} />
          </aside>
        )}
        <section className="flex-1 mt-6">
          {typeof children === "function" ? children(activeTab) : children}
        </section>
      </div>
    </Wrapper>
  );
};

export { Page };
