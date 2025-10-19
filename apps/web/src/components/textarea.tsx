import clsx from "clsx";
import { TextareaHTMLAttributes, useId } from "react";
import { Label } from "./label";
import { HelpText } from "./help-text";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  isRequired?: boolean;
}

const Textarea = ({
  label,
  error,
  className,
  isRequired,
  ...rest
}: TextareaProps) => {
  const id = useId();

  const classes = clsx(
    "flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    className
  );

  return (
    <div className="flex flex-col gap-2">
      {Boolean(label) && (
        <Label htmlFor={id} isRequired={isRequired}>
          {label}
        </Label>
      )}
      <textarea id={id} className={classes} {...rest} />
      {Boolean(error) && <HelpText variant="error">{error}</HelpText>}
    </div>
  );
};

export { Textarea, type TextareaProps };
