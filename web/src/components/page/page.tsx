import { ReactNode, useEffect, useState } from "react";
import { Sidebar, SidebarItemProps } from "./sidebar";
import clsx from "clsx";
import { Breadcrumbs, BreadcrumbProps } from "./breadcrumbs";

interface Props {
  title?: string;
  sidebarItems?: SidebarItemProps[];
  breadcrumbs?: BreadcrumbProps[];
  isInline?: boolean;
  headerContent?: ReactNode;
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
      document.title = `${import.meta.env.VITE_SITE_NAME} - ${title}`.replace(
        "{TAB}",
        activeTab ?? ""
      );
    }
  }, [title, activeTab]);

  return (
    <div className="flex flex-col w-full h-full p-2 md:p-0">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
          {`${title}`.replace("{TAB}", activeTab ?? "")}
        </h1>
        {headerContent}
      </div>
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
