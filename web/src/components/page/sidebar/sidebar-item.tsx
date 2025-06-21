import { Button, ButtonProps } from "@components";
import clsx from "clsx";
import { motion } from "framer-motion";

interface SidebarItemProps
  extends Omit<ButtonProps, "variant" | "textAlignment" | "className"> {
  label: string;
  isActive?: boolean;
  isHidden?: boolean;
  isLabelVisible?: boolean;
}

const SidebarItem = ({
  label,
  isActive,
  isHidden,
  isLabelVisible,
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
        "relative z-10 font-normal bg-transparent transition-colors duration-300 w-8 md:w-auto",
        isActive ? "text-white" : "text-primary"
      )}
      {...rest}
    >
      {isActive && (
        <motion.div
          layout
          layoutId="sidebar-selected"
          className="absolute bottom-0 left-0 right-0 w-8 rounded-md pointer-events-none md:w-auto bg-primary h-9 -z-10 bg-blend-difference"
        />
      )}
      {isLabelVisible ? label : null}
    </Button>
  );
};

export { SidebarItem, type SidebarItemProps };
