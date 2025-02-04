import { Tab } from "./tabs-tab";

interface Props<TTab extends string> {
  tabs: TTab[];
  activeTab: TTab;
  onChange: (tab: TTab) => void;
}

const Tabs = <TTab extends string>({
  tabs,
  activeTab,
  onChange,
}: Props<TTab>) => {
  return (
    <div className="flex gap-0.5 items-center bg-accent p-0.5 rounded-md">
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
