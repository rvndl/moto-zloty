import clsx from "clsx";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import Spinner from "@assets/svg/spinner.svg?react";

export type ButtonSize = "default" | "small";
export type ButtonVariant = "primary" | "secondary";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const Button = ({
  size = "default",
  variant = "primary",
  isLoading,
  children,
  className,
  ...rest
}: PropsWithChildren<Props>) => {
  const classes = clsx(
    "gap-2 rounded-md inline-flex shadow items-center font-medium justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",

    // sizes
    size === "small" && "h-8 px-4 py-2 text-xs",
    size === "default" && "h-9 px-3 text-sm",

    // variants
    variant === "primary" && "bg-primary text-white hover:bg-primary/90",
    variant === "secondary" && "bg-white text-primary hover:bg-primary/10",
    className
  );

  return (
    <button className={classes} {...rest}>
      {isLoading && <Spinner />}
      {children}
    </button>
  );
};

export { Button };
