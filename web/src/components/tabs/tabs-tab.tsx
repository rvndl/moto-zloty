import { Button } from "@components";
import { motion } from "framer-motion";

interface Props<TTab extends string> {
  tab: TTab;
  activeTab: TTab;
  onChange: (tab: TTab) => void;
}

const Tab = <TTab extends string>({
  tab,
  activeTab,
  onChange,
}: Props<TTab>) => {
  return (
    <Button
      key={tab}
      variant="ghost"
      size="small"
      className="relative z-10 bg-transparent hover:bg-transparent"
      onClick={() => onChange(tab)}
    >
      {activeTab === tab && (
        <motion.div
          layout
          layoutId="tab-indicator"
          className="absolute inset-0 bg-white rounded-md shadow -z-10"
        />
      )}
      {tab}
    </Button>
  );
};

export { Tab };
