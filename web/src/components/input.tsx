import { InputHTMLAttributes, useId } from "react";
import { Label } from "./label";
import { HelpText } from "./help-text";
import { twMerge } from "tailwind-merge";

type InputSize = "small" | "default";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  size?: InputSize;
  error?: string;
  isRequired?: boolean;
}

const Input = ({
  className,
  label,
  size = "default",
  error,
  isRequired,
  ...rest
}: InputProps) => {
  const id = useId();

  const classes = twMerge(
    "flex w-full px-3 rounded-md border border-input bg-transparent shadow-sm transition-colors placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    size === "default" && "h-9 py-1 text-sm",
    size === "small" && "h-8 py-2 text-xs",
    className
  );

  return (
    <div className="flex flex-col gap-2">
      {Boolean(label) && (
        <Label htmlFor={id} isRequired={isRequired}>
          {label}
        </Label>
      )}
      <input id={id} className={classes} {...rest} />
      {Boolean(error) && <HelpText variant="error">{error}</HelpText>}
    </div>
  );
};

export { Input, type InputProps };
