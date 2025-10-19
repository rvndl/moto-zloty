import { LabelHTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  isRequired?: boolean;
}

const Label = ({
  children,
  className,
  isRequired,
  ...rest
}: PropsWithChildren<Props>) => {
  return (
    <label
      className={twMerge(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...rest}
    >
      {children} {isRequired && <span className="text-red-500">*</span>}
    </label>
  );
};

export { Label };
