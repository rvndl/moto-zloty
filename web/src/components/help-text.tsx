import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { motion, MotionProps } from "framer-motion";

type HelpTextVariant = "standard" | "error";
type HelpTextSize = "sm" | "xs";

type ElementPropsWithClassName = MotionProps & { className?: string };

interface Props extends ElementPropsWithClassName {
  variant?: HelpTextVariant;
  size?: HelpTextSize;
}

const HelpText = ({
  variant = "standard",
  size = "sm",
  children,
  className,
  ...rest
}: PropsWithChildren<Props>) => {
  return (
    <motion.p
      className={twMerge(
        "leading-none",
        variant === "error" ? "text-red-500" : "text-muted",
        size === "xs" ? "text-xs" : "text-sm",
        className
      )}
      key={children + ""}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.3 }}
      {...rest}
    >
      {children}
    </motion.p>
  );
};

export { HelpText };
