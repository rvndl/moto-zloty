import { ReactNode, useState } from "react";
import { Sidebar, SidebarItemProps } from "./sidebar";

interface Props {
  sidebarItems?: SidebarItemProps[];
  children: ((tab?: string) => ReactNode) | ReactNode;
}

const Page = ({ sidebarItems, children }: Props) => {
  const [activeTab, setActiveTab] = useState(sidebarItems?.[0]?.label);

  return (
    <div className="flex w-full h-full gap-4">
      {sidebarItems && (
        <section className="w-52">
          <Sidebar items={sidebarItems} onChange={setActiveTab} />
        </section>
      )}
      <section className="flex-1">
        {typeof children === "function" ? children(activeTab) : children}
      </section>
    </div>
  );
};

export { Page };
