import { Button, ButtonProps } from "@components";
import clsx from "clsx";
import { motion } from "framer-motion";

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
      variant="ghost"
      textAlignment="left"
      className={clsx(
        "relative z-10 font-normal bg-transparent transition-colors duration-300",
        isActive ? "text-white" : "text-primary"
      )}
      {...rest}
    >
      {isActive && (
        <motion.div
          layout
          layoutId="sidebar-selected"
          className="absolute bottom-0 left-0 right-0 rounded-md pointer-events-none bg-primary h-9 -z-10 bg-blend-difference"
        />
      )}
      {label}
    </Button>
  );
};

export { SidebarItem, type SidebarItemProps };
