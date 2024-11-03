import { Button, ButtonProps } from "@components/ui";

interface SidebarItemProps
  extends Omit<ButtonProps, "variant" | "textAlignment" | "className"> {
  label: string;
  isActive?: boolean;
}

const SidebarItem = ({ isActive, label, ...rest }: SidebarItemProps) => {
  return (
    <Button
      variant={isActive ? "primary" : "ghost"}
      textAlignment="left"
      className="font-normal"
      {...rest}
    >
      {label}
    </Button>
  );
};

export { SidebarItem, type SidebarItemProps };
