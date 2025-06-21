import { HTMLAttributes } from "react";
import { Tab } from "./tabs-tab";
import { twMerge } from "tailwind-merge";

interface Props<TTab extends string>
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: TTab[];
  activeTab: TTab;
  onChange: (tab: TTab) => void;
}

const Tabs = <TTab extends string>({
  tabs,
  activeTab,
  className,
  onChange,
  ...rest
}: Props<TTab>) => {
  return (
    <div
      className={twMerge(
        "flex gap-0.5 items-center bg-accent p-0.5 rounded-md",
        className
      )}
      {...rest}
    >
      {tabs.map((tab) => (
        <Tab<TTab>
          key={tab}
          tab={tab}
          activeTab={activeTab}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export { Tabs };
