import clsx from "clsx";
import { InputHTMLAttributes, useId } from "react";
import { Label } from "./label";
import { HelpText } from "./help-text";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isRequired?: boolean;
  error?: string;
}

const Input = ({
  className,
  isRequired,
  label,
  error,
  ...rest
}: InputProps) => {
  const id = useId();

  const classes = clsx(
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
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
