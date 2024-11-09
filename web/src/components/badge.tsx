import { HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type BadgeVariant = "primary" | "success" | "danger" | "secondary";

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const Badge = ({
  children,
  variant = "primary",
  className,
  ...rest
}: PropsWithChildren<Props>) => {
  const classes = twMerge(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    variant === "primary" &&
      "border-transparent bg-black shadow hover:bg-black/80 text-white",
    variant === "danger" &&
      "border-transparent bg-red-500 text-white shadow hover:bg-red-500/80",
    variant === "secondary" && "bg-accent border",
    className
  );
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

export { Badge };
