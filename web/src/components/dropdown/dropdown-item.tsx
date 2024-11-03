import { Button } from "@components/ui";
import { ReactNode } from "react";

interface DropdownItemProps {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

const DropdownItem = ({ label, icon, onClick }: DropdownItemProps) => {
  return (
    <Button
      variant="ghost"
      textAlignment="left"
      className="flex content-start w-full h-8 font-normal leading-none hover:bg-accent"
      icon={icon}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export { DropdownItem, type DropdownItemProps };
