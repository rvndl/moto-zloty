import { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import Spinner from "@assets/svg/spinner.svg?react";
import { twMerge } from "tailwind-merge";

export type ButtonSize = "default" | "small";
export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonTextAlignment = "left" | "center" | "right";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  textAlignment?: ButtonTextAlignment;
  icon?: ReactNode;
  loadingText?: string;
  isLoading?: boolean;
}

const Button = ({
  size = "default",
  variant = "primary",
  textAlignment = "center",
  icon,
  loadingText,
  isLoading,
  children,
  className,
  ...rest
}: PropsWithChildren<ButtonProps>) => {
  const classes = twMerge(
    "gap-2 rounded-md inline-flex items-center font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",

    // sizes
    size === "small" && "h-8 px-4 py-2 text-xs",
    size === "default" && "h-9 px-3 text-sm",

    // alignments
    textAlignment === "left" && "justify-start",
    textAlignment === "center" && "justify-center",
    textAlignment === "right" && "justify-end",

    // variants
    variant === "primary" &&
      "bg-primary shadow-sm text-white hover:bg-primary/90",
    variant === "secondary" && "bg-white shadow-sm hover:bg-accent",
    variant === "ghost" && "bg-transparent hover:bg-accent",
    variant === "outline" && "border shadow-sm hover:bg-accent",
    className
  );

  return (
    <button className={classes} {...rest}>
      {Boolean(icon) && !isLoading && <span className="w-4 -ml-1">{icon}</span>}
      {isLoading && <Spinner fill="currentColor" className="w-4 h-4 -ml-1" />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
};

export { Button, type ButtonProps };
