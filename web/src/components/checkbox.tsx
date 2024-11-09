import { Checkbox as HeadlessCheckbox } from "@headlessui/react";
import { ComponentProps } from "react";
import { CheckIcon } from "./icons";
import clsx from "clsx";
import { Label } from "./label";

interface CheckboxProps extends ComponentProps<typeof HeadlessCheckbox> {
  label?: string;
  isRequired?: boolean;
}

const Checkbox = ({ label, isRequired, ...rest }: CheckboxProps) => {
  const handleOnToggle = () => {
    rest.onChange?.(!rest.checked);
  };

  return (
    <div className="flex items-center gap-2">
      <HeadlessCheckbox
        className={clsx(
          "w-4 h-4 border flex items-center justify-center rounded-sm shadow peer shrink-0 border-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          rest.checked && "bg-primary text-white"
        )}
        {...rest}
      >
        {rest.checked && <CheckIcon className="mt-0.5" />}
      </HeadlessCheckbox>
      {Boolean(label) && (
        <Label isRequired={isRequired} onClick={handleOnToggle}>
          {label}
        </Label>
      )}
    </div>
  );
};

export { Checkbox };
