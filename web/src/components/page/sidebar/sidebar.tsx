import { Card } from "@components/card";
import { SidebarItem, SidebarItemProps } from "./sidebar-item";
import { useState } from "react";

interface Props {
  items?: SidebarItemProps[];
  onChange: (item: string) => void;
}

const Sidebar = ({ items, onChange }: Props) => {
  const [activeItem, setActiveItem] = useState(items?.[0]?.label);

  const handleOnChange = (item: string) => {
    setActiveItem(item);
    onChange(item);
  };

  return (
    <Card className="flex flex-col p-4" contentClassName="w-full flex flex-col">
      {items?.map(({ label, ...rest }) => (
        <SidebarItem
          key={label}
          isActive={activeItem === label}
          label={label}
          onClick={() => handleOnChange(label)}
          {...rest}
        />
      ))}
    </Card>
  );
};

export { Sidebar };
