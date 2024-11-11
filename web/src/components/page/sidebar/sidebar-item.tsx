import { Button, ButtonProps } from "@components";

interface SidebarItemProps
  extends Omit<ButtonProps, "variant" | "textAlignment" | "className"> {
  label: string;
  isActive?: boolean;
  isHidden?: boolean;
}

const SidebarItem = ({
  label,
  isActive,
  isHidden,
  ...rest
}: SidebarItemProps) => {
  if (isHidden) {
    return null;
  }

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
