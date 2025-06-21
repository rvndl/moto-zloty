import { Card } from "@components";
import { SidebarItem, SidebarItemProps } from "./sidebar-item";
import { useState } from "react";
import { useIsMobile } from "@hooks/use-is-mobile";

interface Props {
  items?: SidebarItemProps[];
  onChange: (item: string) => void;
}

const Sidebar = ({ items, onChange }: Props) => {
  const [activeItem, setActiveItem] = useState(items?.[0]?.label);
  const isMobile = useIsMobile();

  const handleOnChange = (item: string) => {
    setActiveItem(item);
    onChange(item);
  };

  return (
    <Card className="flex flex-col" contentClassName="w-full flex flex-col">
      {items?.map(({ label, ...rest }) => (
        <SidebarItem
          key={label}
          isActive={activeItem === label}
          label={label}
          isLabelVisible={!isMobile}
          onClick={() => handleOnChange(label)}
          {...rest}
        />
      ))}
    </Card>
  );
};

export { Sidebar };
