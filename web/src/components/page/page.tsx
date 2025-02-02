import { ReactNode, useEffect, useState } from "react";
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
}

const Page = ({
  title,
  sidebarItems,
  breadcrumbs,
  isInline,
  headerContent,
  children,
}: Props) => {
  const [activeTab, setActiveTab] = useState(sidebarItems?.[0]?.label);

  useEffect(() => {
    if (title) {
      document.title = `${import.meta.env.VITE_SITE_NAME} - ${title} ${
        activeTab ? " - " + activeTab : ""
      }`;
    }
  }, [title, activeTab]);

  return (
    <div className="flex flex-col w-full h-full p-2 md:p-0">
      <PageHeader title={title} content={headerContent} activeTab={activeTab} />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div
        className={clsx(
          "flex w-full h-full gap-4 mt-4",
          !isInline && "flex-col"
        )}
      >
        {sidebarItems && (
          <section className="w-52">
            <Sidebar items={sidebarItems} onChange={setActiveTab} />
          </section>
        )}
        <section className="flex-1">
          {typeof children === "function" ? children(activeTab) : children}
        </section>
      </div>
    </div>
  );
};

export { Page };
