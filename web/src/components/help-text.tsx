import { HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type HelpTextVariant = "standard" | "error";
type HelpTextSize = "sm" | "xs";

interface Props extends HTMLAttributes<HTMLParagraphElement> {
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
    <p
      className={twMerge(
        "leading-none",
        variant === "error" ? "text-red-500" : "text-muted",
        size === "xs" ? "text-xs" : "text-sm",
        className
      )}
      {...rest}
    >
      {children}
    </p>
  );
};

export { HelpText };
