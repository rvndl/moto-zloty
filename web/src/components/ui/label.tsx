import { LabelHTMLAttributes, PropsWithChildren } from "react";

type LabelVariant = "standard" | "error";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  varaint?: LabelVariant;
  isRequired?: boolean;
}

const Label = ({
  varaint = "standard",
  children,
  isRequired,
  ...rest
}: PropsWithChildren<Props>) => {
  if (varaint === "error") {
    return (
      <label className="-mt-1 text-sm leading-none text-red-500" {...rest}>
        {children}
      </label>
    );
  }

  return (
    <label
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      {...rest}
    >
      {children} {isRequired && <span className="text-red-500">*</span>}
    </label>
  );
};

export { Label };
